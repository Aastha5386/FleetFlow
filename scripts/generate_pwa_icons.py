import os
from PIL import Image, ImageDraw, ImageFont

def generate_icons():
    public_dir = r"C:\Users\shivansh\Desktop\fleetflow-mern-latest\public"
    os.makedirs(public_dir, exist_ok=True)

    def draw_fleetflow_icon(size, is_maskable=False):
        # Create image with RGBA
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Colors
        cobalt_dark = (29, 78, 216)    # #1D4ED8
        cobalt_main = (37, 99, 235)    # #2563EB
        cobalt_light = (96, 165, 250)  # #60A5FA
        white = (255, 255, 255)
        amber = (245, 158, 11)

        # Background
        if is_maskable:
            # Full bleed background for maskable
            draw.rectangle([0, 0, size, size], fill=cobalt_main)
            # Safe zone circle radius: size * 0.4
            center_x, center_y = size // 2, size // 2
        else:
            # Rounded squircle for standard icons
            corner_radius = int(size * 0.22)
            draw.rounded_rectangle([0, 0, size, size], radius=corner_radius, fill=cobalt_main)

        # Add subtle modern diagonal accent
        draw.polygon([
            (int(size * 0.4), 0),
            (size, 0),
            (size, int(size * 0.6)),
            (int(size * 0.1), size),
            (0, size),
            (0, int(size * 0.8))
        ], fill=(30, 64, 175, 80))

        # Draw Modern Stylized Fleet Truck & Arrow Logo
        cx, cy = size / 2, size / 2
        scale = size / 192.0

        # Dynamic Logistics Arrow & Truck Cab
        # 1. Main Truck Body
        truck_left = cx - 44 * scale
        truck_top = cy - 24 * scale
        truck_right = cx + 44 * scale
        truck_bottom = cy + 28 * scale

        # Container
        draw.rounded_rectangle(
            [truck_left, truck_top, cx + 10 * scale, truck_bottom],
            radius=int(6 * scale),
            fill=white
        )

        # Speed trail grooves inside container
        groove_color = (226, 232, 240)
        for i in range(3):
            gy = truck_top + (12 + i * 14) * scale
            draw.rounded_rectangle(
                [truck_left + 10 * scale, gy, cx + 2 * scale, gy + 4 * scale],
                radius=int(2 * scale),
                fill=groove_color
            )

        # Cab front
        draw.polygon([
            (cx + 12 * scale, truck_bottom),
            (cx + 12 * scale, truck_top + 10 * scale),
            (cx + 28 * scale, truck_top + 10 * scale),
            (cx + 42 * scale, truck_top + 24 * scale),
            (cx + 42 * scale, truck_bottom)
        ], fill=white)

        # Cab windshield
        draw.polygon([
            (cx + 18 * scale, truck_top + 14 * scale),
            (cx + 26 * scale, truck_top + 14 * scale),
            (cx + 36 * scale, truck_top + 24 * scale),
            (cx + 18 * scale, truck_top + 24 * scale)
        ], fill=cobalt_dark)

        # Wheels
        wheel_r = 10 * scale
        w1_x = cx - 24 * scale
        w2_x = cx + 26 * scale
        wy = truck_bottom + 4 * scale

        # Wheel 1
        draw.ellipse([w1_x - wheel_r, wy - wheel_r, w1_x + wheel_r, wy + wheel_r], fill=(15, 23, 42))
        draw.ellipse([w1_x - wheel_r*0.4, wy - wheel_r*0.4, w1_x + wheel_r*0.4, wy + wheel_r*0.4], fill=white)

        # Wheel 2
        draw.ellipse([w2_x - wheel_r, wy - wheel_r, w2_x + wheel_r, wy + wheel_r], fill=(15, 23, 42))
        draw.ellipse([w2_x - wheel_r*0.4, wy - wheel_r*0.4, w2_x + wheel_r*0.4, wy + wheel_r*0.4], fill=white)

        # Glowing Lightning / Arrow above
        arrow_points = [
            (cx - 20 * scale, cy - 38 * scale),
            (cx + 8 * scale, cy - 38 * scale),
            (cx - 2 * scale, cy - 28 * scale),
            (cx + 22 * scale, cy - 28 * scale),
            (cx - 10 * scale, cy - 14 * scale),
            (cx - 4 * scale, cy - 24 * scale),
            (cx - 20 * scale, cy - 24 * scale)
        ]
        draw.polygon(arrow_points, fill=amber)

        return img

    # Generate icons
    sizes = [
        ("icon-192.png", 192, False),
        ("icon-512.png", 512, False),
        ("icon-maskable-192.png", 192, True),
        ("icon-maskable-512.png", 512, True),
        ("apple-touch-icon.png", 180, False),
        ("favicon-32x32.png", 32, False),
        ("favicon-16x16.png", 16, False),
    ]

    for filename, s, maskable in sizes:
        icon_img = draw_fleetflow_icon(s, maskable)
        dest = os.path.join(public_dir, filename)
        icon_img.save(dest, "PNG")
        print(f"Generated: {dest}")

if __name__ == "__main__":
    generate_icons()
