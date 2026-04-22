import os
import re

def remove_comments(code, file_extension):
    # This pattern handles both single-line (//) and multi-line (/* */) comments
    if file_extension in ['.js', '.jsx', '.ts', '.tsx', '.css']:
        # Remove multi-line comments
        code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        # Remove single-line comments (careful not to remove URL strings)
        code = re.sub(r'(?<!:)\/\/.*', '', code)
    elif file_extension == '.py':
        # Remove python comments
        code = re.sub(r'#.*', '', code)
    
    # Remove empty lines left over after stripping comments
    lines = [line for line in code.splitlines() if line.strip()]
    return "\n".join(lines)

def generate_code_dump():
    output_file = "plain.txt"
    # Extensions we want to extract
    valid_extensions = ('.js', '.jsx', '.py', '.css', '.html', '.json')
    # Folders we want to skip
    skip_folders = {'node_modules', '.git', '.vscode', 'dist', 'build'}

    with open(output_file, 'w', encoding='utf-8') as f_out:
        for root, dirs, files in os.walk('.'):
            # Skip hidden or unnecessary folders
            dirs[:] = [d for d in dirs if d not in skip_folders]

            for file in files:
                if file.endswith(valid_extensions) and file != output_file and file != 'extract_code.py':
                    file_path = os.path.join(root, file)
                    # Standardize path to use forward slashes like src/components/...
                    display_path = file_path.replace(os.sep, '/').lstrip('./')

                    try:
                        with open(file_path, 'r', encoding='utf-8') as f_in:
                            content = f_in.read()
                            
                            # Clean the code
                            file_ext = os.path.splitext(file)[1]
                            clean_content = remove_comments(content, file_ext)

                            # Write to the plain.txt file
                            f_out.write(f"// FILE PATH: {display_path}\n")
                            f_out.write("-" * 50 + "\n")
                            f_out.write(clean_content + "\n\n")
                            f_out.write("=" * 50 + "\n\n")
                    except Exception as e:
                        print(f"Could not read {display_path}: {e}")

    print(f"Extraction complete! All code is saved in {output_file}")

if __name__ == "__main__":
    generate_code_dump()