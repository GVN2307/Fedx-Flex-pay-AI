import flex_pay
import sys

# Redirect stdout to a file
with open('clean_output.txt', 'w', encoding='utf-8') as f:
    original_stdout = sys.stdout
    sys.stdout = f
    try:
        flex_pay.main()
    finally:
        sys.stdout = original_stdout
