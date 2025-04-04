// /shared/sections/analytics/hooks/useAnalyticsApi.tsx

import { useState, useEffect } from 'react';

// --------------------------------------
// Types
// --------------------------------------
export type DateRange = {
  startDate: Date;
  endDate: Date;
  label?: string;
};

export type FilterValues = {
  level: string;
  dateRange: DateRange;
  searchQuery: string;
  engagementRate?: string; // For children view
  connectionFrequency?: string; // For parents view
  parentActivity?: string; // For parents view
  // NOTE: comparison is removed from here; each chart handles locally
};

export type ChildrenAnalyticsData = {
  activeUsers: {
    total: number;
    increment: number;
    comparison?: number;
  };
  averageSessionDuration: {
    total: number;
    increment: number;
    comparison?: number;
  };
  engagementRate: {
    total: number;
    increment: number;
    comparison?: number;
  };
  atRiskUsers: {
    total: number;
    increment: number;
    comparison?: number;
  };
  activityData: {
    labels: string[];
    series: Array<{
      name: string;
      type: string;
      fill: string;
      data: number[];
    }>;
    // If compareRange is set, we might return comparisonSeries:
    comparisonSeries?: Array<{
      name: string;
      type: string;
      fill: string;
      data: number[];
    }>;
  };
  activeUsersData: {
    categories: string[];
    data: number[];
    comparisonData?: number[];
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
    comparisonData?: number[];
  }>;
};

export type ParentsAnalyticsData = {
  activeParents: {
    total: number;
    increment: number;
    comparison?: number;
  };
  connectionFrequency: {
    total: number;
    increment: number;
    comparison?: number;
  };
  averageViewTime: {
    total: number;
    increment: number;
    comparison?: number;
  };
  parentFeedback: {
    total: number;
    increment: number;
    comparison?: number;
  };
  activityData: {
    labels: string[];
    series: Array<{
      name: string;
      type: string;
      fill: string;
      data: number[];
    }>;
    comparisonSeries?: Array<{
      name: string;
      type: string;
      fill: string;
      data: number[];
    }>;
  };
  activeParentsData: {
    categories: string[];
    data: number[];
    comparisonData?: number[];
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
    comparisonData?: number[];
  }>;
};

// --------------------------------------
// Extend FilterValues to include an optional compareRange
// that each chart can pass in locally
// --------------------------------------
type LocalFilters = FilterValues & {
  compareRange?: DateRange | null;
};

// --------------------------------------
// Hook
// --------------------------------------
export function useAnalyticsApi(view: 'children' | 'parents', filters: LocalFilters) {
  const [loading, setLoading] = useState(true);
  const [childrenData, setChildrenData] = useState<ChildrenAnalyticsData | null>(null);
  const [parentsData, setParentsData] = useState<ParentsAnalyticsData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Simulate a real API call:
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (view === 'children') {
          // Mocked data for "children" usage:
          const mockChildrenData: ChildrenAnalyticsData = {
            activeUsers: {
              total: 1892,
              increment: 12.5,
              comparison: filters.compareRange ? 1680 : undefined,
            },
            averageSessionDuration: {
              total: 28,
              increment: 5.2,
              comparison: filters.compareRange ? 25 : undefined,
            },
            engagementRate: {
              total: 78,
              increment: -2.3,
              comparison: filters.compareRange ? 80 : undefined,
            },
            atRiskUsers: {
              total: 85,
              increment: 18.7,
              comparison: filters.compareRange ? 67 : undefined,
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
              comparisonSeries: filters.compareRange
                ? [
                    {
                      name: 'CP (précédent)',
                      type: 'line',
                      fill: 'solid',
                      data: [18, 20, 19, 22, 21, 24, 26, 28, 27, 25, 26, 27],
                    },
                    {
                      name: 'CM1 (précédent)',
                      type: 'line',
                      fill: 'solid',
                      data: [29, 27, 30, 32, 34, 33, 35, 37, 38, 36, 35, 34],
                    },
                    {
                      name: 'CM2 (précédent)',
                      type: 'line',
                      fill: 'solid',
                      data: [22, 23, 25, 27, 29, 31, 30, 28, 29, 31, 33, 32],
                    },
                  ]
                : undefined,
            },
            activeUsersData: {
              categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
              data: [1661, 1621, 1743, 1688, 1651, 1220, 1019],
              comparisonData: filters.compareRange
                ? [1545, 1532, 1625, 1598, 1580, 1150, 950]
                : undefined,
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
              {
                name: '8h-10h',
                data: [42, 50, 65, 45, 38, 8, 3],
                comparisonData: filters.compareRange ? [38, 45, 60, 40, 35, 7, 2] : undefined,
              },
              {
                name: '10h-12h',
                data: [48, 52, 70, 52, 42, 5, 1],
                comparisonData: filters.compareRange ? [44, 48, 65, 47, 38, 4, 1] : undefined,
              },
              {
                name: '12h-14h',
                data: [18, 20, 22, 18, 15, 3, 0],
                comparisonData: filters.compareRange ? [16, 18, 20, 16, 13, 2, 0] : undefined,
              },
              {
                name: '14h-16h',
                data: [58, 62, 68, 55, 52, 12, 5],
                comparisonData: filters.compareRange ? [52, 56, 62, 50, 47, 10, 4] : undefined,
              },
              {
                name: '16h-18h',
                data: [65, 70, 72, 68, 62, 18, 8],
                comparisonData: filters.compareRange ? [60, 65, 67, 63, 57, 15, 7] : undefined,
              },
              {
                name: '18h-20h',
                data: [50, 52, 55, 48, 45, 28, 20],
                comparisonData: filters.compareRange ? [45, 47, 50, 43, 40, 25, 18] : undefined,
              },
              {
                name: '20h-22h',
                data: [22, 25, 28, 24, 20, 12, 8],
                comparisonData: filters.compareRange ? [20, 22, 25, 21, 18, 10, 7] : undefined,
              },
            ],
          };

          setChildrenData(mockChildrenData);
        } else {
          // Mocked data for "parents" usage:
          const mockParentsData: ParentsAnalyticsData = {
            activeParents: {
              total: 1245,
              increment: 8.3,
              comparison: filters.compareRange ? 1150 : undefined,
            },
            connectionFrequency: {
              total: 2.4,
              increment: 3.7,
              comparison: filters.compareRange ? 2.2 : undefined,
            },
            averageViewTime: {
              total: 12,
              increment: 7.8,
              comparison: filters.compareRange ? 10 : undefined,
            },
            parentFeedback: {
              total: 65,
              increment: 15.2,
              comparison: filters.compareRange ? 55 : undefined,
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
              comparisonSeries: filters.compareRange
                ? [
                    {
                      name: 'Parents CP (précédent)',
                      type: 'line',
                      fill: 'solid',
                      data: [9, 10, 9, 11, 13, 12, 14, 13, 11, 12, 13, 14],
                    },
                    {
                      name: 'Parents CM1 (précédent)',
                      type: 'line',
                      fill: 'solid',
                      data: [12, 11, 13, 14, 16, 15, 17, 18, 16, 15, 14, 13],
                    },
                    {
                      name: 'Parents CM2 (précédent)',
                      type: 'line',
                      fill: 'solid',
                      data: [10, 11, 12, 13, 14, 15, 14, 13, 12, 13, 14, 13],
                    },
                  ]
                : undefined,
            },
            activeParentsData: {
              categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
              data: [845, 812, 780, 825, 868, 456, 320],
              comparisonData: filters.compareRange
                ? [780, 750, 720, 760, 800, 420, 290]
                : undefined,
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
              {
                name: '8h-10h',
                data: [15, 18, 12, 16, 20, 5, 2],
                comparisonData: filters.compareRange ? [13, 16, 10, 14, 18, 4, 1] : undefined,
              },
              {
                name: '10h-12h',
                data: [22, 24, 18, 25, 28, 12, 8],
                comparisonData: filters.compareRange ? [19, 21, 16, 22, 25, 10, 6] : undefined,
              },
              {
                name: '12h-14h',
                data: [20, 22, 15, 18, 21, 10, 5],
                comparisonData: filters.compareRange ? [18, 19, 13, 16, 18, 8, 4] : undefined,
              },
              {
                name: '14h-16h',
                data: [18, 20, 16, 19, 22, 8, 4],
                comparisonData: filters.compareRange ? [16, 18, 14, 17, 19, 7, 3] : undefined,
              },
              {
                name: '16h-18h',
                data: [28, 32, 25, 30, 35, 15, 10],
                comparisonData: filters.compareRange ? [25, 28, 22, 27, 31, 13, 8] : undefined,
              },
              {
                name: '18h-20h',
                data: [45, 48, 40, 45, 50, 35, 28],
                comparisonData: filters.compareRange ? [40, 43, 36, 40, 45, 30, 24] : undefined,
              },
              {
                name: '20h-22h',
                data: [38, 40, 35, 42, 45, 25, 18],
                comparisonData: filters.compareRange ? [34, 36, 31, 37, 40, 22, 15] : undefined,
              },
            ],
          };

          setParentsData(mockParentsData);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
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
