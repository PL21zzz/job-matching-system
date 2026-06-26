from pathlib import Path
from pypdf import PdfReader

paths = [
    r"D:\download\TTTN\DATN\GRADUATION_PROJECT_REPORT_NGUYEN_TUAN_PHONG_22IT.B158_EN.pdf",
    r"D:\download\TTTN\DATN\SLIDE_GRADUATION THESIS-NGUYEN_TUAN_PHONG-22IT.B158.pdf.pdf",
]

output = Path(r"D:\projects\job-matching-system\tmp_pdf_extract_output.txt")

parts = []
for path in paths:
    reader = PdfReader(path)
    parts.append(f"FILE: {path}")
    parts.append(f"PAGES: {len(reader.pages)}")
    page_indexes = list(range(min(12, len(reader.pages))))
    if "SLIDE_GRADUATION" in path:
        page_indexes = list(range(len(reader.pages)))
    for i in page_indexes:
        text = (reader.pages[i].extract_text() or "").replace("\n", " ")
        parts.append(f"--- PAGE {i+1} ---")
        parts.append(text[:3500])
    parts.append("=== END FILE ===")

output.write_text("\n".join(parts), encoding="utf-8")
print(str(output))
