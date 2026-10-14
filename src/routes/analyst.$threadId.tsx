import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ensureThread, saveThreadMessages } from "@/lib/analyst/threads";
import type { UIMessage } from "ai";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { useAnalyticsStore } from "@/stores/useAnalyticsStore";
import logo from "@/assets/analyst-logo.png";

export const Route = createFileRoute("/analyst/$threadId")({
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  return <ThreadChat key={threadId} threadId={threadId} />;
}

function ThreadChat({ threadId }: { threadId: string }) {
  const [messages] = useState<UIMessage[]>(() => ensureThread(threadId).messages);
  const signals = useAnalyticsStore((s) => s.signals);

  useEffect(() => {
    saveThreadMessages(threadId, messages);
  }, [messages, threadId]);

  const decided = signals.filter((s) => s.outcome === "win" || s.outcome === "loss").length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          <ConversationEmptyState>
            <div className="mt-4 flex flex-col items-center gap-3 text-center">
              <img src={logo} alt="" className="h-14 w-14" />
              <h2 className="text-base font-semibold">Спросите об истории своих сигналов</h2>
              <p className="max-w-md text-xs text-muted-foreground">
                В истории: {signals.length} сигналов, с исходом — {decided}. ИИ также видит итоги бэктестов.
                Это аналитика, а не торговые сигналы.
              </p>
              <p className="mt-2 text-sm font-medium text-warning-400">AI analyst unavailable</p>
            </div>
          </ConversationEmptyState>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl p-3">
        <PromptInput onSubmit={() => {}}>
          <PromptInputTextarea
            placeholder="AI analyst unavailable"
            disabled
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status="ready" disabled />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Не инвестиционная рекомендация. Любую гипотезу ИИ проверяйте форвард-тестом.
        </p>
      </div>
    </div>
  );
}
