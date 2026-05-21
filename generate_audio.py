#!/usr/bin/env python3
"""生成所有文章的有声版 MP3（edge-tts）"""

import os, sys, re, asyncio, argparse, time
from pathlib import Path
from bs4 import BeautifulSoup

PUBLIC = Path(__file__).parent / "public"
AUDIO_DIR = PUBLIC / "audio"
VOICE = "zh-CN-XiaoxiaoNeural"  # 女声，中英混合效果好

def extract_text(html_path: Path) -> str:
    """从文章 HTML 提取正文纯文本，跳过程序代码"""
    with open(html_path, encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    main = soup.select_one(".main")
    if not main:
        main = soup.body
    if not main:
        return ""

    # 移除代码块、SVG 等
    for sel in ["pre", "code", "svg", "style", "script", "aside", "nav"]:
        for el in main.select(sel):
            el.decompose()

    text = main.get_text(separator="\n", strip=True)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r" {2,}", " ", text)
    return text.strip()


def split_text(text: str, max_chars: int = 3000) -> list[str]:
    """按句子边界切分，每段不超过 max_chars"""
    sentences = re.split(r"(?<=[。！？；\n])", text)
    chunks = []
    buf = ""
    for s in sentences:
        if len(buf) + len(s) > max_chars and buf:
            chunks.append(buf.strip())
            buf = s
        else:
            buf += s
    if buf.strip():
        chunks.append(buf.strip())
    return chunks


async def generate_one(html_path: Path, force: bool = False):
    name = html_path.stem
    mp3_path = AUDIO_DIR / f"{name}.mp3"

    if mp3_path.exists() and not force:
        size_mb = mp3_path.stat().st_size / 1024 / 1024
        print(f"  ✅ {name} 已存在 ({size_mb:.1f} MB)，跳过")
        return

    print(f"  📖 {name} 提取文本...", end=" ", flush=True)
    text = extract_text(html_path)
    if not text:
        print("❌ 无内容")
        return
    print(f"{len(text)}字", end=" ", flush=True)

    # 安全限制：太长就截断（edge-tts 有隐含上限）
    if len(text) > 20000:
        print(f"(截断到 20000 字)", end=" ", flush=True)
        text = text[:20000]

    # 写临时文本文件
    tmp_txt = AUDIO_DIR / f"_{name}.txt"
    tmp_txt.write_text(text, encoding="utf-8")

    print("→ 合成语音...", end=" ", flush=True)
    t0 = time.time()
    proc = await asyncio.create_subprocess_exec(
        "edge-tts", "--voice", VOICE, "-f", str(tmp_txt), "--write-media", str(mp3_path),
        stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()
    elapsed = time.time() - t0
    tmp_txt.unlink(missing_ok=True)

    if proc.returncode != 0:
        err = stderr.decode()[:200] if stderr else ""
        print(f"❌ 失败: {err}")
        return

    size_mb = mp3_path.stat().st_size / 1024 / 1024
    print(f"✅ {size_mb:.1f} MB ({elapsed:.0f}s)")


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="强制重新生成")
    parser.add_argument("--only", type=str, help="只生成指定文章（如 mysql）")
    args = parser.parse_args()

    AUDIO_DIR.mkdir(exist_ok=True)

    html_files = sorted(PUBLIC.glob("*.html"))
    # 跳过首页和工具页
    skip = {"index", "test", "leetcode-patterns", "leetcode-data"}
    # LC 模式页太多且内容短，一并跳过
    articles = [f for f in html_files if f.stem not in skip and not f.stem.startswith("lc-")]

    if args.only:
        articles = [PUBLIC / f"{args.only}.html"]

    print(f"🎙️  使用语音: {VOICE}")
    print(f"📂 输出目录: {AUDIO_DIR}")
    print(f"📄 共 {len(articles)} 篇文章\n")

    for i, path in enumerate(articles, 1):
        print(f"[{i}/{len(articles)}]", end=" ")
        await generate_one(path, force=args.force)

    print(f"\n🎉 完成！文件在 {AUDIO_DIR}/")
    # 统计
    total = sum(1 for f in AUDIO_DIR.glob("*.mp3"))
    total_size = sum(f.stat().st_size for f in AUDIO_DIR.glob("*.mp3"))
    print(f"   共 {total} 个 MP3，总大小 {total_size/1024/1024:.1f} MB")


if __name__ == "__main__":
    asyncio.run(main())
