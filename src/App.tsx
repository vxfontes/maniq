import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks";
import Login from "./pages/Login";
import ChatWithHistory from "./pages/ChatWithHistory";
import AuthLoading from "./pages/AuthLoading";

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return <AuthLoading />;
    }

    if (!user) {
        return <Login />;
    }

    return <ChatWithHistory />;
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
