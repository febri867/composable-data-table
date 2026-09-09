import type { RowData } from '@tanstack/react-table'

export type TeamMember = { name: string; initials: string; image?: string }
export type ProjectStatus = 'Verified' | 'Ongoing' | 'On Hold' | 'Rejected'
export type WorkLocation = 'Office' | 'Remote'

export type Project = RowData & {
  id: string
  owner: string
  role: string
  city: string
  location: WorkLocation
  project: string
  status: ProjectStatus
  members: TeamMember[]
  progress: number
  avatar?: string
}

const people = [
  ['Balaji Nant', 'Lead Product Designer', 'Vancouver', 'Office', 'Verified'],
  ['Nithya Menon', 'UI Designer', 'Bangalore', 'Remote', 'Ongoing'],
  ['Meera Gonzalez', 'Product Designer', 'Toronto', 'Office', 'On Hold'],
  ['Karthik Subramanian', 'Sub Content', 'Coimbatore', 'Remote', 'Ongoing'],
  ['Mithra B', 'Product Designer', 'Vancouver', 'Office', 'Verified'],
  ['Jagatesh Narayanan', 'UX Designer', 'Coimbatore', 'Remote', 'Rejected'],
  ['Steve Rogers', 'Developer', 'Toronto', 'Office', 'Verified'],
  ['Aisha Khan', 'Frontend Engineer', 'Bangalore', 'Remote', 'Ongoing'],
  ['Daniel Park', 'Product Engineer', 'Vancouver', 'Office', 'Verified'],
  ['Sofia Rossi', 'UX Researcher', 'Toronto', 'Remote', 'On Hold'],
  ['Arjun Rao', 'Staff Engineer', 'Bangalore', 'Office', 'Verified'],
  ['Maya Chen', 'Design Lead', 'Vancouver', 'Remote', 'Ongoing'],
  ['Noah Williams', 'Engineer', 'Toronto', 'Office', 'Verified'],
  ['Priya Shah', 'Content Designer', 'Bangalore', 'Remote', 'Rejected'],
  ['Ethan Lee', 'Frontend Engineer', 'Coimbatore', 'Office', 'Ongoing'],
  ['Olivia Smith', 'Product Designer', 'Toronto', 'Remote', 'Verified'],
  ['Lucas Martin', 'Developer', 'Vancouver', 'Office', 'Ongoing'],
  ['Ava Wilson', 'UX Designer', 'Bangalore', 'Remote', 'Verified'],
  ['Ravi Kumar', 'Engineer', 'Coimbatore', 'Office', 'On Hold'],
  ['Emma Brown', 'Product Designer', 'Toronto', 'Remote', 'Verified'],
] as const

const members: TeamMember[] = [
  { name: 'Balaji', initials: 'BN', image: '/avatars/avatar-01.svg' },
  { name: 'Nithya', initials: 'NM', image: '/avatars/avatar-02.svg' },
  { name: 'Meera', initials: 'MG', image: '/avatars/avatar-03.svg' },
  { name: 'Karthik', initials: 'KS', image: '/avatars/avatar-04.svg' },
  { name: 'Mithra', initials: 'MB', image: '/avatars/avatar-05.svg' },
  { name: 'Aisha', initials: 'AK', image: '/avatars/avatar-06.svg' },
]

export const projectData: Project[] = Array.from({ length: 96 }, (_, index) => {
  const source = people[index % people.length]
  return {
    id: `project-${index + 1}`,
    owner: source[0],
    role: source[1],
    city: source[2],
    location: source[3] as WorkLocation,
    project: index % 4 === 0 ? 'balajinant.com' : `project/user${849 + index}`,
    status: source[4] as ProjectStatus,
    members: Array.from(
      { length: 3 + (index % 3) },
      (_, memberIndex) => members[(index + memberIndex) % members.length],
    ),
    progress: 42 + ((index * 13) % 59),
    avatar: `/avatars/avatar-${String((index % 12) + 1).padStart(2, '0')}.svg`,
  }
})

export type PlaygroundUser = {
  id: string
  name: string
  email: string
  role: 'Engineer' | 'Designer' | 'Manager' | 'Product'
  status: 'Active' | 'Invited' | 'Suspended'
  team: 'Platform' | 'Product' | 'Design' | 'Growth'
  score: number
}
const roles: PlaygroundUser['role'][] = [
  'Engineer',
  'Designer',
  'Manager',
  'Product',
]
const statuses: PlaygroundUser['status'][] = ['Active', 'Invited', 'Suspended']
const teams: PlaygroundUser['team'][] = [
  'Platform',
  'Product',
  'Design',
  'Growth',
]
const names = [
  'Aisha Khan',
  'Balaji Nant',
  'Meera Gonzalez',
  'Nithya Menon',
  'Karthik Subramanian',
  'Sofia Rossi',
  'Daniel Park',
  'Maya Chen',
  'Arjun Rao',
  'Priya Shah',
  'Noah Williams',
  'Emma Brown',
]
export const playgroundData: PlaygroundUser[] = Array.from(
  { length: 160 },
  (_, index) => {
    const name = names[index % names.length]
    return {
      id: `USR-${String(index + 1).padStart(4, '0')}`,
      name,
      email: `${name.toLowerCase().replaceAll(' ', '.')}+${index + 1}@example.com`,
      role: roles[index % roles.length],
      status: statuses[index % statuses.length],
      team: teams[index % teams.length],
      score: 60 + ((index * 17) % 41),
    }
  },
)
