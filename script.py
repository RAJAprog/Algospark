import os

base_dir = "V-CODEX"

directories = [
    "public",
    "src/api",
    "src/components/editor",
    "src/components/faculty",
    "src/components/student",
    "src/components/ui",
    "src/context",
    "src/firebase",
    "src/hooks",
    "src/pages"
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = [
    "src/api/compilerService.js",
    "src/api/examService.js",
    "src/api/userService.js",
    "src/components/editor/CodeEditor.jsx",
    "src/components/editor/TerminalPanel.jsx",
    "src/components/faculty/ExamEditor.jsx",
    "src/components/faculty/QuestionForm.jsx",
    "src/components/faculty/ResultsTable.jsx",
    "src/components/faculty/RosterManager.jsx",
    "src/components/student/QuestionViewer.jsx",
    "src/components/ui/Avatar.jsx",
    "src/components/ui/Button.jsx",
    "src/components/ui/Modal.jsx",
    "src/components/ui/ResizablePanels.jsx",
    "src/components/ui/Timer.jsx",
    "src/context/AuthContext.jsx",
    "src/context/AuthProvider.jsx",
    "src/firebase/config.js",
    "src/hooks/useExamSession.js",
    "src/hooks/useProctoring.js",
    "src/pages/ExamDashboardPage.jsx",
    "src/pages/ExamPage.jsx",
    "src/pages/FacultyDashboardPage.jsx",
    "src/pages/FacultyLoginPage.jsx",
    "src/pages/FacultySetupPage.jsx",
    "src/pages/HomePage.jsx",
    "src/pages/LoginPage.jsx",
    "src/pages/PracticePage.jsx",
    "src/App.jsx",
    "src/index.css",
    "src/main.jsx",
    ".env",
    "package.json",
    "vite.config.js"
]

for f in files:
    file_path = os.path.join(base_dir, f)
    with open(file_path, "w") as file:
        pass

print("Project structure created successfully!")