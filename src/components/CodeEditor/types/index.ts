import type { ModelItem } from "@/lib/gen-ai";

export interface CodeEditorProps {
    initialModels: ModelItem[];
    initialNextPageToken: string | null;
};