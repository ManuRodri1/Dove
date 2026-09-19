import { blockRenderers } from "@/components/stories/blocks";
import type { PublicCampaignBlock } from "@/lib/cms/public-campaigns";
import type { PublicStoryBlock } from "@/lib/cms/public-stories";

export type RenderableBlock = PublicStoryBlock | PublicCampaignBlock;

export default function BlockRenderer({ blocks }: { blocks: RenderableBlock[] }) {
  return <div className="story-renderer">{blocks.filter((block) => block.visible !== false).sort((a, b) => a.sortOrder - b.sortOrder).map((block) => {
    const Renderer = blockRenderers[block.blockType as keyof typeof blockRenderers];
    return Renderer ? <Renderer key={block.id} block={block as PublicStoryBlock} /> : null;
  })}</div>;
}
