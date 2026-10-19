import { createHash, randomBytes } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';
import type { NdaRow, NdaSignatureInput, NdaViewer } from './types';

/** How long the personal link in the email stays redeemable. */
export const LINK_DAYS = 30;

export interface NdaRepository {
  /** Stores the signature and returns the one-time plaintext link token. */
  create(input: NdaSignatureInput): Promise<{ id: string; token: string }>;
  /**
   * Redeems a link token: null when unknown, expired or revoked. Counts the
   * open, so the dashboard shows who has actually been in.
   */
  redeem(token: string, at?: Date): Promise<NdaViewer | null>;
  /** Newest first. */
  list(): Promise<NdaRow[]>;
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createPrismaNdaRepository(prisma: PrismaClient): NdaRepository {
  return {
    async create(input) {
      const token = randomBytes(32).toString('base64url');
      const row = await prisma.dataroomNda.create({
        data: {
          name: input.name,
          email: input.email,
          firm: input.firm ?? null,
          ndaVersion: input.ndaVersion,
          ip: input.ip ?? null,
          userAgent: input.userAgent?.slice(0, 500) ?? null,
          tokenHash: hashToken(token),
          tokenExpiresAt: new Date(
            Date.now() + LINK_DAYS * 24 * 60 * 60 * 1000,
          ),
        },
        select: { id: true },
      });
      return { id: row.id, token };
    },

    async redeem(token, at = new Date()) {
      const row = await prisma.dataroomNda.findUnique({
        where: { tokenHash: hashToken(token) },
      });
      if (!row || row.revokedAt || row.tokenExpiresAt < at) return null;
      await prisma.dataroomNda.update({
        where: { id: row.id },
        data: {
          firstOpenedAt: row.firstOpenedAt ?? at,
          lastOpenedAt: at,
          openCount: { increment: 1 },
        },
      });
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        firm: row.firm,
        ndaVersion: row.ndaVersion,
        signedAt: row.signedAt,
      };
    },

    async list() {
      return prisma.dataroomNda.findMany({
        orderBy: { signedAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          firm: true,
          ndaVersion: true,
          signedAt: true,
          firstOpenedAt: true,
          lastOpenedAt: true,
          openCount: true,
          revokedAt: true,
        },
      });
    },
  };
}
