import { LoadingIndicator } from '../components/ui';

export default function AuthLoading() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center space-y-4">
                <LoadingIndicator size="lg" />
                <p className="text-gray-400">Carregando...</p>
            </div>
        </div>
    );
}
