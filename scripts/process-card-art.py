from PIL import Image
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "cards")
os.makedirs(OUT_DIR, exist_ok=True)

TARGET = 240
PAD = 6


def whiten_to_transparent(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA")).astype(np.float32)
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    m = np.minimum(np.minimum(r, g), b)
    lower, upper = 225.0, 246.0
    scale = np.clip((m - lower) / (upper - lower), 0.0, 1.0)
    new_a = a * (1 - scale)
    arr[..., 3] = new_a
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def autocrop_and_square(img: Image.Image, target=TARGET, pad=PAD) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size
    side = max(w, h) + pad * 2
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - w) // 2, (side - h) // 2), img)
    canvas = canvas.resize((target, target), Image.LANCZOS)
    return canvas


def process_suit_icons():
    src = Image.open(
        "/Users/adam/Downloads/Generated image 1.png"
    ).convert("RGBA")
    w, h = src.size
    cell_w = w // 4
    names = ["zaludy", "zelene", "cervene", "kule"]
    for i, name in enumerate(names):
        cell = src.crop((i * cell_w, 0, (i + 1) * cell_w, h))
        cell = autocrop_and_square(cell)
        out_path = os.path.join(OUT_DIR, f"suit-{name}.png")
        cell.save(out_path)
        print("saved", out_path)


ROW_BOUNDARIES = [0, 357, 680, 983, 1254]
COL_BOUNDARIES = [0, 313, 629, 945, 1254]


def process_face_cards():
    src = Image.open(
        "/Users/adam/Downloads/Generated image 1 (1).png"
    ).convert("RGB")
    src = whiten_to_transparent(src)
    row_suits = ["kule", "cervene", "zaludy", "zelene"]
    col_ranks = ["J", "Q", "K", "A"]
    for r, suit in enumerate(row_suits):
        for c, rank in enumerate(col_ranks):
            box = (
                COL_BOUNDARIES[c],
                ROW_BOUNDARIES[r],
                COL_BOUNDARIES[c + 1],
                ROW_BOUNDARIES[r + 1],
            )
            cell = src.crop(box)
            cell = autocrop_and_square(cell)
            out_path = os.path.join(OUT_DIR, f"face-{suit}-{rank}.png")
            cell.save(out_path)
            print("saved", out_path)


process_suit_icons()
process_face_cards()
