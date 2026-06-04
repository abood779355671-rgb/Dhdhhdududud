'use client';
  import { useEffect, useState } from 'react';

  interface Props {
    targetDate: string;
    targetTime?: string;
  }

  function calcTime(target: Date) {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  export default function CountdownTimer({ targetDate, targetTime }: Props) {
    const target = new Date(`${targetDate}T${targetTime || '00:00'}`);
    const [time, setTime] = useState(calcTime(target));

    useEffect(() => {
      const id = setInterval(() => setTime(calcTime(target)), 1000);
      return () => clearInterval(id);
    }, [targetDate, targetTime]);

    const units = [
      { label: 'يوم', value: time.days },
      { label: 'ساعة', value: time.hours },
      { label: 'دقيقة', value: time.minutes },
      { label: 'ثانية', value: time.seconds },
    ];

    return (
      <div className="flex justify-center gap-4 rtl" dir="rtl">
        {units.map(u => (
          <div key={u.label} className="flex flex-col items-center">
            <span className="text-4xl font-bold text-gold-400 font-amiri">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="text-xs text-gold-200/70 mt-1">{u.label}</span>
          </div>
        ))}
      </div>
    );
  }
  