import { Instruction } from '@iroha2/data-model';
import { http } from '~shared/api';

declare global {
  export interface Transaction {
    committed: boolean,
    block_hash: string;
    block_height: number;
    hash: string;
    payload: {
      account_id: string;
      instructions: Instruction[];
      creation_time: string;
      time_to_live_ms: number;
      nonce: null | number;
      metadata: any;
    }
    signatures: Signature[];
    rejection_reason?: string;
  }
}

function hexToBytes(hex: string) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }

  return Uint8Array.from(bytes);
}

export function mapFromDto(transaction: TransactionDto): Transaction {
  // FIXME
  // const instructions = transaction.payload.instructions.c
  //   ?.map((i: string) => Instruction.fromBuffer(hexToBytes(i))) ?? [];
  const instructions: Instruction[] = []

  return {
    committed: transaction.rejection_reason !== undefined,
    block_hash: transaction.block_hash,
    block_height: transaction.block_height ?? 0,
    hash: transaction.hash,
    signatures: transaction.signatures,
    payload: {
      ...transaction.payload,
      instructions,
    },
  };
};

export async function fetchList(params?: PaginationParams): Promise<Paginated<Transaction>> {
  const res = await http.fetchTransactions(params);
  const data = res.data.map(mapFromDto);
  return {
    pagination: res.pagination,
    data,
  };
}
