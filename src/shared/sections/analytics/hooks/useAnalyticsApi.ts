import { useState, useEffect } from 'react';

// Types for analytics data
export type ChildrenAnalyticsData = {
  activeUsers: {
    total: number;
    increment: number;
  };
  averageSessionDuration: {
    total: number;
    increment: number;
  };
  engagementRate: {
    total: number;
    increment: number;
  };
  atRiskUsers: {
    total: number;
    increment: number;
  };
  activityData: {
    labels: string[];
    series: Array<{
      name: string;
      type: string;
      fill: string;
      data: number[];
    }>;
  };
  activeUsersData: {
    categories: string[];
    data: number[];
  };
  disengagedUsers: Array<{
    id: string;
    name: string;
    level: string;
    lastLogin: Date;
    engagementDrop: number;
    avatarUrl: string;
  }>;
  activityHeatmap: Array<{
    name: string;
    data: number[];
  }>;
};

export type ParentsAnalyticsData = {
  activeParents: {
    total: number;
    increment: number;
  };
  connectionFrequency: {
    total: number;
    increment: number;
  };
  averageViewTime: {
    total: number;
    increment: number;
  };
  parentFeedback: {
    total: number;
    increment: number;
  };
  activityData: {
    labels: string[];
    series: Array<{
      name: string;
      type: string;
      fill: string;
      data: number[];
    }>;
  };
  activeParentsData: {
    categories: string[];
    data: number[];
  };
  nonActiveParents: Array<{
    id: string;
    name: string;
    childLevel: string;
    lastLogin: Date;
    missedUpdates: number;
    avatarUrl: string;
  }>;
  parentActivityHeatmap: Array<{
    name: string;
    data: number[];
  }>;
};

export type FilterValues = {
  level: string;
  dateRange: string;
  searchQuery: string;
  engagementRate?: string; // Pour la vue enfants
  connectionFrequency?: string; // Pour la vue parents
  parentActivity?: string; // Pour la vue parents
};

// Hook for fetching analytics data
export function useAnalyticsApi(view: 'children' | 'parents', filters: FilterValues) {
  const [loading, setLoading] = useState(true);
  const [childrenData, setChildrenData] = useState<ChildrenAnalyticsData | null>(null);
  const [parentsData, setParentsData] = useState<ParentsAnalyticsData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we're simulating a fetch with a timeout

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data for children view
        if (view === 'children') {
          // This would fetch from the API with the filters applied
          // For now, returning mock data
          const mockChildrenData: ChildrenAnalyticsData = {
            activeUsers: {
              total: 1892,
              increment: 12.5,
            },
            averageSessionDuration: {
              total: 28,
              increment: 5.2,
            },
            engagementRate: {
              total: 78,
              increment: -2.3,
            },
            atRiskUsers: {
              total: 85,
              increment: 18.7,
            },
            activityData: {
              labels: [
                '01/03/2025',
                '02/03/2025',
                '03/03/2025',
                '04/03/2025',
                '05/03/2025',
                '06/03/2025',
                '07/03/2025',
                '08/03/2025',
                '09/03/2025',
                '10/03/2025',
                '11/03/2025',
                '12/03/2025',
              ],
              series: [
                {
                  name: 'CP',
                  type: 'line',
                  fill: 'solid',
                  data: [20, 23, 22, 25, 24, 28, 30, 32, 30, 29, 30, 31],
                },
                {
                  name: 'CM1',
                  type: 'line',
                  fill: 'solid',
                  data: [32, 30, 33, 35, 37, 36, 38, 40, 42, 41, 39, 38],
                },
                {
                  name: 'CM2',
                  type: 'line',
                  fill: 'solid',
                  data: [25, 26, 28, 30, 33, 35, 34, 32, 33, 35, 37, 36],
                },
              ],
            },
            activeUsersData: {
              categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
              data: [1661, 1621, 1743, 1688, 1651, 1220, 1019],
            },
            disengagedUsers: [
              {
                id: 'u1',
                name: 'Emma Dupont',
                level: 'CP',
                lastLogin: new Date('2025-03-28T10:15:00'),
                engagementDrop: 37,
                avatarUrl: '/assets/avatars/avatar_1.jpg',
              },
              {
                id: 'u2',
                name: 'Lucas Martin',
                level: 'CM1',
                lastLogin: new Date('2025-03-26T14:30:00'),
                engagementDrop: 42,
                avatarUrl: '/assets/avatars/avatar_2.jpg',
              },
              {
                id: 'u3',
                name: 'Léa Bernard',
                level: 'CM2',
                lastLogin: new Date('2025-03-25T09:45:00'),
                engagementDrop: 29,
                avatarUrl: '/assets/avatars/avatar_3.jpg',
              },
              {
                id: 'u4',
                name: 'Hugo Petit',
                level: 'CP',
                lastLogin: new Date('2025-03-23T16:20:00'),
                engagementDrop: 46,
                avatarUrl: '/assets/avatars/avatar_4.jpg',
              },
              {
                id: 'u5',
                name: 'Camille Roux',
                level: 'CM1',
                lastLogin: new Date('2025-03-20T11:10:00'),
                engagementDrop: 51,
                avatarUrl: '/assets/avatars/avatar_5.jpg',
              },
            ],
            activityHeatmap: [
              { name: '8h-10h', data: [42, 50, 65, 45, 38, 8, 3] },
              { name: '10h-12h', data: [48, 52, 70, 52, 42, 5, 1] },
              { name: '12h-14h', data: [18, 20, 22, 18, 15, 3, 0] },
              { name: '14h-16h', data: [58, 62, 68, 55, 52, 12, 5] },
              { name: '16h-18h', data: [65, 70, 72, 68, 62, 18, 8] },
              { name: '18h-20h', data: [50, 52, 55, 48, 45, 28, 20] },
              { name: '20h-22h', data: [22, 25, 28, 24, 20, 12, 8] },
            ],
          };

          setChildrenData(mockChildrenData);
        } else {
          // Mock data for parents view
          const mockParentsData: ParentsAnalyticsData = {
            activeParents: {
              total: 1245,
              increment: 8.3,
            },
            connectionFrequency: {
              total: 2.4,
              increment: 3.7,
            },
            averageViewTime: {
              total: 12,
              increment: 7.8,
            },
            parentFeedback: {
              total: 65,
              increment: 15.2,
            },
            activityData: {
              labels: [
                '01/03/2025',
                '02/03/2025',
                '03/03/2025',
                '04/03/2025',
                '05/03/2025',
                '06/03/2025',
                '07/03/2025',
                '08/03/2025',
                '09/03/2025',
                '10/03/2025',
                '11/03/2025',
                '12/03/2025',
              ],
              series: [
                {
                  name: 'Parents CP',
                  type: 'line',
                  fill: 'solid',
                  data: [10, 12, 11, 13, 15, 14, 16, 15, 13, 14, 15, 16],
                },
                {
                  name: 'Parents CM1',
                  type: 'line',
                  fill: 'solid',
                  data: [14, 13, 15, 16, 18, 17, 19, 20, 18, 17, 16, 15],
                },
                {
                  name: 'Parents CM2',
                  type: 'line',
                  fill: 'solid',
                  data: [12, 13, 14, 15, 16, 17, 16, 15, 14, 15, 16, 15],
                },
              ],
            },
            activeParentsData: {
              categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
              data: [845, 812, 780, 825, 868, 456, 320],
            },
            nonActiveParents: [
              {
                id: 'p1',
                name: 'Michel Dupont',
                childLevel: 'CP',
                lastLogin: new Date('2025-03-15T10:15:00'),
                missedUpdates: 7,
                avatarUrl: '/assets/avatars/avatar_6.jpg',
              },
              {
                id: 'p2',
                name: 'Sophie Martin',
                childLevel: 'CM1',
                lastLogin: new Date('2025-03-12T14:30:00'),
                missedUpdates: 12,
                avatarUrl: '/assets/avatars/avatar_7.jpg',
              },
              {
                id: 'p3',
                name: 'Thomas Bernard',
                childLevel: 'CM2',
                lastLogin: new Date('2025-03-08T09:45:00'),
                missedUpdates: 15,
                avatarUrl: '/assets/avatars/avatar_8.jpg',
              },
              {
                id: 'p4',
                name: 'Julie Petit',
                childLevel: 'CP',
                lastLogin: new Date('2025-03-05T16:20:00'),
                missedUpdates: 18,
                avatarUrl: '/assets/avatars/avatar_9.jpg',
              },
              {
                id: 'p5',
                name: 'Alexandre Roux',
                childLevel: 'CM1',
                lastLogin: new Date('2025-02-28T11:10:00'),
                missedUpdates: 22,
                avatarUrl: '/assets/avatars/avatar_10.jpg',
              },
            ],
            parentActivityHeatmap: [
              { name: '8h-10h', data: [15, 18, 12, 16, 20, 5, 2] },
              { name: '10h-12h', data: [22, 24, 18, 25, 28, 12, 8] },
              { name: '12h-14h', data: [20, 22, 15, 18, 21, 10, 5] },
              { name: '14h-16h', data: [18, 20, 16, 19, 22, 8, 4] },
              { name: '16h-18h', data: [28, 32, 25, 30, 35, 15, 10] },
              { name: '18h-20h', data: [45, 48, 40, 45, 50, 35, 28] },
              { name: '20h-22h', data: [38, 40, 35, 42, 45, 25, 18] },
            ],
          };

          setParentsData(mockParentsData);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    };

    fetchData();
  }, [view, filters]);

  return {
    loading,
    childrenData,
    parentsData,
    error,
  };
}
