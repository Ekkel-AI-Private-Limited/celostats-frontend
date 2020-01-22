import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { color, colorRange, formatNumber } from 'src/app/shared'

export interface Context {
  block: number
  node: EthstatsNode
}

export interface Column {
  name: string
  icon: string
  default?: boolean
  first?: boolean
  accessor: (node: EthstatsNode) => string | number
  show?: (value: string | number, context: Context) => string | number
  color?: (value: string | number, context: Context) => color
}

export const columns: Column[] = [
  {
    name: 'Status',
    icon: 'done',
    accessor: node => +node.stats?.active,
    show: value => value ? 'online' : 'offline',
    color: value => value ? 'ok' : 'warn3',
  },
  {
    name: 'Name',
    icon: 'face',
    default: true,
    accessor: node => node.info?.name,
    show: (value: string) => value.length >= 24 ? `${value.substr(0, 21)}...` : value,
  },
  {
    name: 'Address',
    icon: 'person',
    accessor: node => node.id,
    show: value => String(value).replace(/^0x([a-f0-9]{8}).+([a-f0-9]{8})$/i, '0x$1...$2'),
  },
  {
    name: 'Validator group',
    icon: 'group',
    accessor: node => node.validatorData?.affiliation,
    show: value => String(value).replace(/^0x([a-f0-9]{8}).+([a-f0-9]{8})$/i, '0x$1...$2'),
  },
  {
    name: 'Validator',
    icon: 'done_all',
    accessor: node => +node.validatorData?.registered + (+(node.validatorData?.elected || node.stats?.elected) << 1),
    show: value => value === 0 ? 'Full Node' : value === 1 ? 'Registered' : 'Elected',
    color: value => colorRange(3 - +value, [, 1, 2, , , ,])
  },
  {
    name: 'Peers',
    icon: 'people',
    accessor: node => node.stats?.peers || 0,
    color: value => value ? 'ok' : 'no',
  },
  {
    name: 'Pending',
    icon: 'hourglass_empty',
    accessor: node => node.pending || 0,
    color: value => value ? 'ok' : 'info',
  },
  {
    name: 'Block',
    icon: 'archive',
    first: true,
    accessor: node => node.block?.number,
    show: value => value ? '# ' + formatNumber(+value, 0) : 'n/a',
    color: (value, {block}) => value ? colorRange(block - +value, [, 0, 1, 5, 30]) : 'no',
  },
  {name: 'Transactions', icon: 'compare_arrows', accessor: node => node.block?.transactions?.length || 0},
  {
    name: 'Block Time',
    icon: 'timer',
    accessor: node => node.block?.received ? Math.round((Date.now() - +node.block?.received) / 1000) : -Infinity,
    show: value => value !== -Infinity ? value + ' s ago' : 'n/a',
    color: value => value !== -Infinity ? colorRange(+value, [, 10, 30, 60, 600]) : 'no',
  },
  {
    name: 'Latency',
    icon: 'timer',
    accessor: node => +node.stats?.latency || 0,
    show: value => value === 0 ? `${value} ms` : value ? `+${value} ms` : '',
    color: value => colorRange(+value, [0, 10, 100, 1000, 10000]),
  },
  {
    name: 'Propagation time',
    icon: 'wifi_tethering',
    accessor: node => node.block?.propagation || 0,
    show: (value, {node}) => !node.stats?.active ? 'n/a' : `${value} ms`,
    color: (value, {node}) => !node.stats?.active ? 'no' : colorRange(+value, [10, 100, 1000, 10000, 100000]),
  },
  {
    name: 'Uptime',
    icon: 'offline_bolt',
    accessor: node => node.stats?.uptime,
    show: value => `${value} %`,
    color: value => colorRange(100 - +value, [, 0.1, 1, 5, 10, 20]),
  },
]
