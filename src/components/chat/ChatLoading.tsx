import { Avatar, LoadingMessage } from '../ui';

interface ChatLoadingProps {
    hasContext: boolean;
}

export function ChatLoading({ hasContext }: ChatLoadingProps) {
    return (
        <div className="flex justify-start items-center gap-3">
            <Avatar type="ai" />
            <LoadingMessage hasContext={hasContext} />
        </div>
    );
}
