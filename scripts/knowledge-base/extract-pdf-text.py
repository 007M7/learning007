"""Extract auditable text and metadata from a locally downloaded PDF.

This script deliberately works only on local files. Network retrieval and source
licensing are handled separately so that "found a URL" cannot be confused with
"read the manuscript".
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from pypdf import PdfReader


def parse_pages(spec: str | None, total: int) -> list[int]:
    if not spec:
        return list(range(total))

    pages: set[int] = set()
    for part in spec.split(","):
        bounds = part.strip().split("-")
        start = int(bounds[0])
        end = int(bounds[-1])
        if start < 1 or end < start or end > total:
            raise ValueError(f"invalid page range {part!r}; PDF has {total} pages")
        pages.update(range(start - 1, end))
    return sorted(pages)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--pages", help="1-based ranges, for example 1-20,42-55")
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--metadata", required=True, type=Path)
    args = parser.parse_args()

    pdf_bytes = args.pdf.read_bytes()
    reader = PdfReader(args.pdf)
    selected = parse_pages(args.pages, len(reader.pages))

    chunks: list[str] = []
    extracted_chars = 0
    for page_index in selected:
        text = reader.pages[page_index].extract_text() or ""
        extracted_chars += len(text)
        chunks.append(f"\n\n--- PDF page {page_index + 1} ---\n\n{text.strip()}\n")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.metadata.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("".join(chunks), encoding="utf-8")
    args.metadata.write_text(
        json.dumps(
            {
                "source_pdf": args.pdf.as_posix(),
                "sha256": hashlib.sha256(pdf_bytes).hexdigest(),
                "bytes": len(pdf_bytes),
                "total_pdf_pages": len(reader.pages),
                "selected_pdf_pages": [page + 1 for page in selected],
                "extracted_characters": extracted_chars,
                "document_metadata": {
                    str(key): str(value) for key, value in (reader.metadata or {}).items()
                },
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
