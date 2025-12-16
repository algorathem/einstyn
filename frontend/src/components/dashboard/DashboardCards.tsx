import { Clock, TrendingUp, BookOpen, Star } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  date: string;
  findingsCount: number;
  status: 'completed' | 'in-progress' | 'paused';
}

interface DashboardCardsProps {
  sessions: Session[];
}

export const DashboardCards = ({ sessions }: DashboardCardsProps) => {
  const stats = [
    { label: 'Total Sessions', value: sessions.length, icon: BookOpen, color: 'text-primary' },
    { label: 'Findings Today', value: 24, icon: TrendingUp, color: 'text-success' },
    { label: 'Avg. Research Time', value: '2.4h', icon: Clock, color: 'text-warning' },
    { label: 'Top Rated', value: 8, icon: Star, color: 'text-node-tertiary' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-card p-4 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Recent Sessions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="glass-card-hover p-4 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground line-clamp-1">{session.title}</h4>
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${session.status === 'completed' ? 'bg-success/20 text-success' : ''}
                    ${session.status === 'in-progress' ? 'bg-primary/20 text-primary' : ''}
                    ${session.status === 'paused' ? 'bg-warning/20 text-warning' : ''}
                  `}
                >
                  {session.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{session.date}</span>
                <span>{session.findingsCount} findings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
