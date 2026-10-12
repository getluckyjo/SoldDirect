import type { PrismaClient } from '@prisma/client';
import type { Notifier } from '../notifications';
import type { MessageRepository, ReplyOptions } from '../messaging';
import type {
  DemoDealState,
  DemoListingState,
  DemoMessage,
  DemoRepository,
} from './types';

export function createPrismaDemoRepository(
  prisma: PrismaClient,
): DemoRepository {
  return {
    async conversation(phone): Promise<DemoMessage[]> {
      const rows = await prisma.message.findMany({
        where: { OR: [{ fromPhone: phone }, { toPhone: phone }] },
        orderBy: { createdAt: 'asc' },
        take: 400,
        select: {
          direction: true,
          body: true,
          type: true,
          raw: true,
          createdAt: true,
        },
      });
      return rows
        .filter((r) => (r.body ?? '').trim() !== '' || r.type === 'image')
        .map((r) => ({
          direction: r.direction,
          body: r.body ?? '',
          type: r.type,
          mediaId:
            (r.raw as { demoMediaId?: string } | null)?.demoMediaId ??
            undefined,
          options:
            (r.raw as { interactive?: ReplyOptions } | null)?.interactive ??
            undefined,
          createdAt: r.createdAt,
        }));
    },

    async latestListing(phone): Promise<DemoListingState | null> {
      const listing = await prisma.listing.findFirst({
        where: { seller: { phone } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          propertyType: true,
          suburb: true,
          priceZar: true,
          bedrooms: true,
          bathrooms: true,
          exclusivityTermDays: true,
          tier: true,
          status: true,
          description: true,
          estimateLowZar: true,
          estimateHighZar: true,
          createdAt: true,
          _count: { select: { photos: true } },
        },
      });
      if (!listing) return null;
      return {
        id: listing.id,
        title: listing.title,
        propertyType: listing.propertyType,
        suburb: listing.suburb,
        priceZar: Number(listing.priceZar),
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        exclusivityTermDays: listing.exclusivityTermDays,
        tier: listing.tier,
        status: listing.status,
        description: listing.description,
        estimateLowZar: listing.estimateLowZar,
        estimateHighZar: listing.estimateHighZar,
        photoCount: listing._count.photos,
        createdAt: listing.createdAt,
      };
    },

    async latestDeal(phone): Promise<DemoDealState | null> {
      const deal = await prisma.deal.findFirst({
        where: { listing: { seller: { phone } } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          listingId: true,
          createdAt: true,
          buyer: {
            select: { phone: true, bondPrequalified: true },
          },
          events: {
            orderBy: { createdAt: 'asc' },
            select: {
              fromStatus: true,
              toStatus: true,
              actorType: true,
              note: true,
              createdAt: true,
            },
          },
        },
      });
      if (!deal) return null;
      return {
        id: deal.id,
        status: deal.status,
        listingId: deal.listingId,
        buyerPrequalified: deal.buyer.bondPrequalified,
        createdAt: deal.createdAt,
        events: deal.events,
      };
    },
  };
}

let demoOutboundSeq = 0;

/**
 * A notifier that persists the outbound message but never touches a BSP —
 * the demo's replacement for the WhatsApp transport. Everything upstream
 * (dispatcher, flows, agent) is identical to production.
 */
export function createDemoNotifier(repository: MessageRepository): Notifier {
  return {
    async send(to, text, opts) {
      demoOutboundSeq += 1;
      await repository.recordOutbound({
        to,
        text,
        from: 'demo',
        // Carried so the simulator can render the same chips the real
        // WhatsApp client would show as buttons.
        interactive: opts?.interactive,
        waMessageId: `wamid.demo.out.${Date.now()}.${demoOutboundSeq}`,
      });
    },
  };
}
