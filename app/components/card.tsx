'use client'

import Image from 'next/image'
import { ReactNode } from 'react'
import { formatNumber } from '../utils/number'

type StatCardProps = {
  icon: ReactNode
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  isPositive?: boolean
}

export const StatCard = ({
  icon,
  title,
  value,
  change,
  changeLabel = 'From last week',
  isPositive = true,
}: StatCardProps) => {
  return (
    <div
      className="relative p-5 border border-solid rounded-xl
        backdrop-blur-[50px]
        border-[#343A44]
        bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(50%_77.89%_at_50%_0%,rgba(244,179,1,0.05)_0%,rgba(244,179,1,0)_100%)]"
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: 1,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%',
            backgroundImage: `url('/dot.svg')`,
            backgroundSize: '284.77562649276035px 284.77562649276035px',
            backgroundRepeat: 'repeat',
            transform: 'rotate(-15.45deg)',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-[24px]">
        {/* Top section - Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-gray-400 text-base font-normal">{title}</h3>
        </div>

        {/* Middle section - Main Value */}
        <div className="mb-4">
          <p className="text-white text-4xl font-bold">
            {/* {typeof value === "number" ? value.toLocaleString() : value} */}
            {formatNumber(1200)}
          </p>
        </div>

        {/* Bottom section - Change indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            {isPositive ? (
              <Image
                src="/up-arrow.svg"
                alt="Arrow up"
                width={18}
                height={18}
              />
            ) : (
              <Image
                src="/down-arrow.svg"
                alt="Arrow down"
                width={18}
                height={18}
              />
            )}
            <span
              className={`text-base font-normal ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {Math.abs(change)}%
            </span>
            <span className="text-white text-[12px] font-normal">
              {changeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
