import time
from casioplot import *

def run_game():
    # Screen setup (fx-CG50 VRAM is 384x216, but Py app view may vary)
    clear_screen()
    
    # Game Variables
    bird_y = 100
    velocity = 0
    gravity = 1.5
    jump_strength = -5
    
    pipe_x = 200
    pipe_gap = 40
    pipe_top_height = 60
    
    score = 0
    playing = True

    while playing:
        clear_screen()
        
        # 1. Handle Input (Using the EXE or standard key check)
        # Note: The built-in MicroPython module 'getkey' freezes the loop, 
        # so we often check if a standard key state is triggered if using add-ons,
        # or simulate steady falling if relying on standard getkey.
        
        # 2. Physics updates
        velocity += gravity
        bird_y += int(velocity)
        pipe_x -= 4  # Move pipe left
        
        # Recycle pipes when they clear the screen
        if pipe_x < 0:
            pipe_x = 200
            score += 1
            
        # 3. Drawing Elements
        # Draw Bird (represented as a 6x6 pixel block)
        for dx in range(6):
            for dy in range(6):
                set_pixel(30 + dx, bird_y + dy, (255, 200, 0)) # Yellow bird
                
        # Draw Pipes (represented as vertical lines or rectangles)
        for y in range(0, pipe_top_height):
            for x in range(15):
                set_pixel(pipe_x + x, y, (0, 200, 0)) # Top pipe
                
        for y in range(pipe_top_height + pipe_gap, 216):
            for x in range(15):
                set_pixel(pipe_x + x, y, (0, 200, 0)) # Bottom pipe
                
        # 4. Collision Detection
        if bird_y > 210 or bird_y < 0:
            playing = False # Floor/Ceiling crash
            
        if pipe_x <= 36 and pipe_x >= 15:
            if bird_y <= pipe_top_height or (bird_y + 6) >= (pipe_top_height + pipe_gap):
                playing = False # Pipe crash

        show_screen()
        time.sleep(0.05) # Control game speed

    # Game Over screen
    draw_string(50, 100, "GAME OVER", (255, 0, 0), "large")
    draw_string(50, 130, "Score: " + str(score), (255, 255, 255), "medium")
    show_screen()

run_game()