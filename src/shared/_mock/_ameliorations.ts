export const AMELIORATION_TYPES_OPTIONS = ['Parent', 'Etudiant', 'Admin'];

export const AMELIORATION_SOURCES_OPTIONS = ['Signalement', 'Interne'];

export const AMELIORATION_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const AMELIORATION_NIVEAUX_OPTIONS = [
    'CP',
    'CM1',
    'CM2',
    'CE1',
    'CE2',
];

export const MOCK_AMELIORATIONS = [
    {
        id: '1',
        name: 'Amélioration de l\'interface utilisateur',
        type: 'Admin',
        source: 'Signalement',
        status: 'En cours',
        priority: 'High',
        labels: ['UI', 'UX'],
        description: 'Améliorer l\'expérience utilisateur de la page d\'accueil.',
        comments: [],
        assignee: [
            {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                avatarUrl: '',
                role: 'Developer',
                status: 'Active',
                address: '123 Main St.',
                phoneNumber: '123-456-7890',
                lastActivity: null,  // Ensure compatibility with IDateValue
            }
        ],
        reporter: { id: '1', name: 'Admin', avatarUrl: '' },
        piecesJointes: ['file1.pdf'],
        dateCreation: '2025-03-01',
        dateMiseAJour: '2025-03-03',
        niveau: 'CP',
        matiere: 'Français',
        exercice: ['Exercice 1', 'Exercice 2'],
    },
    {
        id: '2',
        name: 'Correction de bugs sur le tableau de bord',
        type: 'Parent',
        source: 'Interne',
        status: 'Résolue',
        priority: 'Medium',
        labels: ['Bug', 'Dashboard'],
        description: 'Fixer les bugs affectant le tableau de bord admin.',
        attachments: ['https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-13.webp'],
        comments: [],
        assignee: [
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                avatarUrl: '',
                role: 'Developer',
                status: 'Active',
                address: '456 Another St.',
                phoneNumber: '987-654-3210',
                lastActivity: null,
            }
        ],
        reporter: { id: '2', name: 'Admin', avatarUrl: '' },
        piecesJointes: ['bug_report.pdf'],
        dateCreation: '2025-02-15',
        dateMiseAJour: '2025-02-20',
        niveau: 'CM1',
        matiere: 'Mathématiques',
        exercice: ['Exercice 3'],
    },
    {
        id: '3',
        name: 'Amélioration de la navigation mobile',
        type: 'Etudiant',
        source: 'Signalement',
        status: 'En cours',
        priority: 'Low',
        labels: ['Mobile', 'Navigation'],
        description: 'Rendre la navigation plus fluide sur les appareils mobiles.',
        attachments: ['https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp'],
        comments: [],
        assignee: [
            {
                id: '3',
                name: 'Mark Wilson',
                email: 'mark.wilson@example.com',
                avatarUrl: '',
                role: 'Frontend Developer',
                status: 'Active',
                address: '789 Elm St.',
                phoneNumber: '555-123-4567',
                lastActivity: null,
            }
        ],
        reporter: { id: '3', name: 'Etudiant', avatarUrl: '' },
        piecesJointes: ['mobile_feedback.pdf'],
        dateCreation: '2025-03-10',
        dateMiseAJour: '2025-03-12',
        niveau: 'CE1',
        matiere: 'Informatique',
        exercice: ['Exercice 4'],
    },
    {
        id: '4',
        name: 'Optimisation de la base de données',
        type: 'Admin',
        source: 'Interne',
        status: 'Nouveau',
        priority: 'High',
        labels: ['Database', 'Optimization'],
        description: 'Améliorer la performance de la base de données.',
        attachments: ['https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-15.webp'],
        comments: [],
        assignee: [
            {
                id: '4',
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                avatarUrl: '',
                role: 'Database Administrator',
                status: 'Active',
                address: '101 Oak St.',
                phoneNumber: '555-987-6543',
                lastActivity: null,
            }
        ],
        reporter: { id: '4', name: 'Admin', avatarUrl: '' },
        piecesJointes: ['db_optimization.pdf'],
        dateCreation: '2025-03-05',
        dateMiseAJour: '2025-03-07',
        niveau: 'CM2',
        matiere: 'Sciences',
        exercice: ['Exercice 5', 'Exercice 6'],
    },
    {
        id: '5',
        name: 'Amélioration de la gestion des notifications',
        type: 'Etudiant',
        source: 'Signalement',
        status: 'Résolue',
        priority: 'Medium',
        labels: ['Notifications', 'UI'],
        description: 'Améliorer la gestion des notifications pour les utilisateurs.',
        // attachments: ['notif_feedback.pdf'],
        comments: [],
        assignee: [
            {
                id: '5',
                name: 'Sophia Lee',
                email: 'sophia.lee@example.com',
                avatarUrl: '',
                role: 'UI/UX Designer',
                status: 'Active',
                address: '202 Maple St.',
                phoneNumber: '555-876-5432',
                lastActivity: null,
            }
        ],
        reporter: { id: '5', name: 'Etudiant', avatarUrl: '' },
        piecesJointes: ['notif_feedback.pdf'],
        dateCreation: '2025-03-03',
        dateMiseAJour: '2025-03-06',
        niveau: 'CE2',
        matiere: 'Français',
        exercice: ['Exercice 7'],
    },
    {
        id: '6',
        name: 'Développement de la fonctionnalité de recherche avancée',
        type: 'Admin',
        source: 'Interne',
        status: 'Rejetée',
        priority: 'High',
        labels: ['Search', 'Feature'],
        description: 'Développer une fonctionnalité de recherche avancée dans l\'application.',
        // attachments: ['search_feature_spec.pdf'],
        comments: [],
        assignee: [
            {
                id: '6',
                name: 'Paul Green',
                email: 'paul.green@example.com',
                avatarUrl: '',
                role: 'Backend Developer',
                status: 'Active',
                address: '303 Birch St.',
                phoneNumber: '555-321-9876',
                lastActivity: null,
            }
        ],
        reporter: { id: '6', name: 'Admin', avatarUrl: '' },
        piecesJointes: ['search_feature_spec.pdf'],
        dateCreation: '2025-02-20',
        dateMiseAJour: '2025-02-25',
        niveau: 'CM2',
        matiere: 'Informatique',
        exercice: ['Exercice 8'],
    },
    {
        id: '7',
        name: 'Revisiter l\'architecture du système de gestion',
        type: 'Parent',
        source: 'Interne',
        status: 'Rejetée',
        priority: 'High',
        labels: ['Architecture', 'Backend'],
        description: 'Revisiter l\'architecture du système de gestion pour améliorer la scalabilité.',
        attachments: ['https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-12.webp'],
        comments: [],
        assignee: [
            {
                id: '7',
                name: 'David Brown',
                email: 'david.brown@example.com',
                avatarUrl: '',
                role: 'System Architect',
                status: 'Active',
                address: '404 Pine St.',
                phoneNumber: '555-654-9876',
                lastActivity: null,
            }
        ],
        reporter: { id: '7', name: 'Admin', avatarUrl: '' },
        piecesJointes: ['system_architecture.pdf'],
        dateCreation: '2025-03-12',
        dateMiseAJour: '2025-03-14',
        niveau: 'CM1',
        matiere: 'Sciences',
        exercice: ['Exercice 9', 'Exercice 10'],
    }
];