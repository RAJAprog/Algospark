// // import React from 'react';
// // import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// // import { AuthProvider } from './context/AuthContext';

// // // Core Pages
// // import HomePage from './pages/HomePage';
// // import LoginPage from './pages/LoginPage';
// // import ProfilePage from './pages/ProfilePage';

// // // Student Specific
// // import StudentDashboard from './pages/StudentDashboard';
// // import StudentForgotPasswordPage from './pages/StudentForgotPasswordPage';
// // import PracticePage from './pages/PracticePage';
// // import ExamPage from './pages/ExamPage';

// // // Faculty Specific
// // import FacultyLoginPage from './pages/FacultyLoginPage';
// // import FacultySetupPage from './pages/FacultySetupPage';
// // import FacultyForgotPasswordPage from './pages/FacultyForgotPasswordPage';
// // import FacultyDashboardPage from './pages/FacultyDashboardPage';

// // const App = () => {
// //     return (
// //         <AuthProvider>
// //             <Router>
// //                 <Switch>
// //                     {/* --- Public Routes --- */}
// //                     <Route exact path="/" component={HomePage} />
// //                     <Route path="/login" component={LoginPage} />
// //                     <Route path="/forgot-password" component={StudentForgotPasswordPage} />

// //                     {/* --- Student Routes --- */}
// //                     <Route path="/dashboard" component={StudentDashboard} />
// //                     <Route path="/profile" component={ProfilePage} />

// //                     {/* ✅ FIX: Changed :questionId → :topicId to match useParams() in PracticePage */}
// //                     <Route path="/practice/:topicId" component={PracticePage} />

// //                     <Route path="/exam/:examId/:submissionId" component={ExamPage} />

// //                     {/* --- Faculty Routes --- */}
// //                     <Route path="/faculty-login" component={FacultyLoginPage} />
// //                     <Route path="/faculty-setup" component={FacultySetupPage} />
// //                     <Route path="/faculty-forgot-password" component={FacultyForgotPasswordPage} />
// //                     <Route path="/faculty-dashboard" component={FacultyDashboardPage} />

// //                     {/* --- 404 --- */}
// //                     <Route path="*">
// //                         <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
// //                             <h2 className="text-xl font-mono uppercase tracking-tighter text-red-500">
// //                                 404 | V-CodeX Route Not Found
// //                             </h2>
// //                         </div>
// //                     </Route>
// //                 </Switch>
// //             </Router>
// //         </AuthProvider>
// //     );
// // };

// // export default App; 

// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';

// // Core Pages
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import ProfilePage from './pages/ProfilePage';

// // Student Specific
// import StudentDashboard from './pages/StudentDashboard';
// import StudentForgotPasswordPage from './pages/StudentForgotPasswordPage';
// import PracticePage from './pages/PracticePage';
// import ExamPage from './pages/ExamPage';
// import FreeSandboxTerminal from './pages/FreeSandboxTerminal';

// // Faculty Specific
// import FacultyLoginPage from './pages/FacultyLoginPage';
// import FacultySetupPage from './pages/FacultySetupPage';
// import FacultyForgotPasswordPage from './pages/FacultyForgotPasswordPage';
// import FacultyDashboardPage from './pages/FacultyDashboardPage';

// const App = () => {
//     return (
//         <AuthProvider>
//             <Router>
//                 <Switch>
//                     {/* --- Public Routes --- */}
//                     <Route exact path="/" component={HomePage} />
//                     <Route path="/login" component={LoginPage} />
//                     <Route path="/forgot-password" component={StudentForgotPasswordPage} />

//                     {/* --- Student Routes --- */}
//                     <Route path="/dashboard" component={StudentDashboard} />
//                     <Route path="/profile" component={ProfilePage} />

//                     {/* Practice routes */}
//                     <Route path="/practice/:topicId" component={PracticePage} />
//                     <Route path="/sandbox" render={(props) => (
//                         <FreeSandboxTerminal
//                             standalone
//                             onBack={() => props.history.push("/dashboard")}
//                         />
//                     )} />

//                     <Route path="/exam/:examId/:submissionId" component={ExamPage} />

//                     {/* --- Faculty Routes --- */}
//                     <Route path="/faculty-login" component={FacultyLoginPage} />
//                     <Route path="/faculty-setup" component={FacultySetupPage} />
//                     <Route path="/faculty-forgot-password" component={FacultyForgotPasswordPage} />
//                     <Route path="/faculty-dashboard" component={FacultyDashboardPage} />

//                     {/* --- 404 --- */}
//                     <Route path="*">
//                         <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//                             <h2 className="text-xl font-mono uppercase tracking-tighter text-red-500">
//                                 404 | V-CodeX Route Not Found
//                             </h2>
//                         </div>
//                     </Route>
//                 </Switch>
//             </Router>
//         </AuthProvider>
//     );
// };

// export default App; 


import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Core Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

// Student Specific
import StudentDashboard from './pages/StudentDashboard';
import StudentForgotPasswordPage from './pages/StudentForgotPasswordPage';
import PracticePage from './pages/PracticePage';
import ExamPage from './pages/ExamPage';
import FreeSandboxTerminal from './pages/FreeSandboxTerminal';

// Faculty Specific
import FacultyLoginPage from './pages/FacultyLoginPage';
import FacultySetupPage from './pages/FacultySetupPage';
import FacultyForgotPasswordPage from './pages/FacultyForgotPasswordPage';
import FacultyDashboardPage from './pages/FacultyDashboardPage';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    {/* --- Public Routes --- */}
                    <Route exact path="/" component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/forgot-password" component={StudentForgotPasswordPage} />

                    {/* --- Student Routes --- */}
                    <Route path="/dashboard" component={StudentDashboard} />
                    <Route path="/profile" component={ProfilePage} />

                    {/* Practice routes */}
                    <Route path="/practice/:topicId" component={PracticePage} />
                    <Route path="/sandbox" render={(props) => (
                        <FreeSandboxTerminal
                            standalone
                            onBack={() => props.history.push("/")}
                        />
                    )} />

                    <Route path="/exam/:examId/:submissionId" component={ExamPage} />

                    {/* --- Faculty Routes --- */}
                    <Route path="/faculty-login" component={FacultyLoginPage} />
                    <Route path="/faculty-setup" component={FacultySetupPage} />
                    <Route path="/faculty-forgot-password" component={FacultyForgotPasswordPage} />
                    <Route path="/faculty-dashboard" component={FacultyDashboardPage} />

                    {/* --- 404 --- */}
                    <Route path="*">
                        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                            <h2 className="text-xl font-mono uppercase tracking-tighter text-red-500">
                                404 | V-CodeX Route Not Found
                            </h2>
                        </div>
                    </Route>
                </Switch>
            </Router>
        </AuthProvider>
    );
};

export default App;