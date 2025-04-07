
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { LiveSession } from "../types";
import { SessionTableRow } from "./session/SessionTableRow";
import { EmptyStateContent } from "./EmptyStateContent";
import { ModerationAction } from "@/types/surveillance";

interface SessionTableProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onRefresh: () => void;
  onShowMediaPreview?: (session: LiveSession) => void;
  onModerate?: (session: LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress?: string | null;
}

export const SessionTable = ({
  sessions,
  isLoading,
  error,
  onMonitorSession,
  onRefresh,
  onShowMediaPreview,
  onModerate,
  actionInProgress
}: SessionTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Creator</TableHead>
          <TableHead>Started At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <EmptyStateContent 
                isLoading={isLoading} 
                error={error} 
                onRefresh={onRefresh} 
              />
            </TableCell>
          </TableRow>
        ) : (
          sessions.map((session) => (
            <SessionTableRow
              key={session.id}
              session={session}
              onMonitorSession={onMonitorSession}
              onShowMediaPreview={onShowMediaPreview}
              onModerate={onModerate}
              actionInProgress={actionInProgress}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};
