import Image from 'next/image'

type EventCardProps = {
  icon: string
  title: string
  value: string
}

const EventCard = ({ icon, title, value }: EventCardProps) => {
  return (
    <div
      className="
      p-5
      rounded-lg
    bg-[linear-gradient(180deg,rgba(255,255,255,0.016)_0%,rgba(255,255,255,0)_50%)]
    border-t border-r border-l border-b-0 border-solid
    border-[#343A44]
    backdrop-blur-[100px]
  "
    >
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Image src={icon} alt="Ticket" width={20} height={20} />
        </div>
        <span className="text-gray-400 text-sm">{title}</span>
        <div className="text-white text-2xl font-bold">{value}</div>
      </div>
    </div>
  )
}

export default EventCard
