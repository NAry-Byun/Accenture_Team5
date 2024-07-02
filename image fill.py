import pygame
import sys

pygame.init()

# Set up display
width, height = 1000, 600
window = pygame.display.set_mode((width, height))
pygame.display.set_caption('Python game part')

# Define colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BUTTON_COLOR = (70, 130, 180)
HOVER_COLOR = (100, 149, 237)

# Function to get user input
def get_user_input(prompt):
    user_input = ""
    font = pygame.font.Font(None, 32)
    input_box = pygame.Rect(300, 250, 200, 32)
    color_inactive = pygame.Color('lightskyblue3')
    color_active = pygame.Color('dodgerblue2')
    color = color_inactive
    active = False

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if input_box.collidepoint(event.pos):
                    active = not active
                else:
                    active = False
                color = color_active if active else color_inactive
            if event.type == pygame.KEYDOWN:
                if active:
                    if event.key == pygame.K_RETURN:
                        return user_input
                    elif event.key == pygame.K_BACKSPACE:
                        user_input = user_input[:-1]
                    else:
                        user_input += event.unicode

        window.fill(BLACK)
        txt_surface = font.render(prompt + user_input, True, color)
        width = max(200, txt_surface.get_width()+10)
        input_box.w = width
        window.blit(txt_surface, (input_box.x+5, input_box.y+5))
        pygame.draw.rect(window, color, input_box, 2)

        pygame.display.flip()

# Load images
images = [
    pygame.image.load('1st.jpg'),
    pygame.image.load('2nd.jpg'),
    pygame.image.load('3rd.jpg'),
    pygame.image.load('4th.jpg')
]

# Scale images to fit quadrants
scaled_images = [pygame.transform.scale(img, (width // 2, height // 2)) for img in images]

def draw_buttons(buttons, labels):
    for i, button in enumerate(buttons):
        if button:  # Only draw buttons that are not None
            color = BUTTON_COLOR
            if button.collidepoint(pygame.mouse.get_pos()):
                color = HOVER_COLOR
            pygame.draw.rect(window, color, button)
            font = pygame.font.SysFont(None, 36)
            text = font.render(labels[i], True, WHITE)
            text_rect = text.get_rect(center=button.center)
            window.blit(text, text_rect)

def draw_reset_button(reset_button):
    color = BUTTON_COLOR
    if reset_button.collidepoint(pygame.mouse.get_pos()):
        color = HOVER_COLOR
    pygame.draw.rect(window, color, reset_button)
    font = pygame.font.SysFont(None, 36)
    text = font.render("Reset", True, WHITE)
    text_rect = text.get_rect(center=reset_button.center)
    window.blit(text, text_rect)

def main():
    running = True
    reset_button = None
    quadrants = [False, False, False, False]

    # Get user inputs for button labels
    prompts = ["Enter Task 1: ", "Enter Task 2: ", "Enter Task 3: ", "Enter Task 4: "]
    labels = [get_user_input(prompt) for prompt in prompts]

    # Define button properties
    button_width, button_height = 150, 50
    buttons = [
        pygame.Rect(50, height - button_height - 50, button_width, button_height),
        pygame.Rect(250, height - button_height - 50, button_width, button_height),
        pygame.Rect(450, height - button_height - 50, button_width, button_height),
        pygame.Rect(650, height - button_height - 50, button_width, button_height)
    ]

    clock = pygame.time.Clock()

    while running:
        window.fill(BLACK)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if reset_button and reset_button.collidepoint(event.pos):
                    main()  # Restart the game
                else:
                    for i, button in enumerate(buttons):
                        if button and button.collidepoint(event.pos):
                            quadrants[i] = True
                            buttons[i] = None  # Remove the button once it's pressed

        # Draw images in their respective quadrants if set
        if quadrants[0]:
            window.blit(scaled_images[0], (0, 0))  # Top-left
        if quadrants[1]:
            window.blit(scaled_images[1], (width // 2, 0))  # Top-right
        if quadrants[2]:
            window.blit(scaled_images[2], (0, height // 2))  # Bottom-left
        if quadrants[3]:
            window.blit(scaled_images[3], (width // 2, height // 2))  # Bottom-right

        # Draw buttons
        draw_buttons(buttons, labels)

        # Check if all buttons are pressed and draw reset button
        if all(quadrants) and not reset_button:
            reset_button = pygame.Rect((width - button_width) // 2, (height - button_height) // 2, button_width, button_height)
        if reset_button:
            draw_reset_button(reset_button)

        pygame.display.flip()
        clock.tick(30)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
