/**
 * BasicWebApp Module Component
 * 
 * Client Component cho Web App động.
 * Sử dụng "use client" để enable React hooks và interactivity.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

interface MenuItem {
  label: string
  href: string
  icon?: string
}

interface ApiConfig {
  endpoint?: string
  apiKey?: string
}

interface Features {
  enableSearch?: boolean
  enableDarkMode?: boolean
  enableNotifications?: boolean
}

interface BasicWebAppData {
  appName: string
  appDescription?: string
  primaryColor?: string
  apiConfig?: ApiConfig
  features?: Features
  menuItems?: MenuItem[]
}

interface DataItem {
  id: number
  title: string
  description: string
  status: 'active' | 'pending' | 'completed'
}

export function BasicWebApp({ data }: { data: BasicWebAppData }) {
  const {
    appName,
    appDescription,
    primaryColor = '#667eea',
    apiConfig,
    features,
    menuItems,
  } = data || {}

  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<DataItem[]>([])
  const [activeMenu, setActiveMenu] = useState(menuItems?.[0]?.href || '/')

  // Simulated data fetch (replace with real API call)
  const fetchData = useCallback(async () => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - in real app, use apiConfig.endpoint
    const mockData: DataItem[] = [
      { id: 1, title: 'Tour Hạ Long Bay', description: 'Du lịch Vịnh Hạ Long 3 ngày 2 đêm', status: 'active' },
      { id: 2, title: 'Tour Đà Nẵng', description: 'Khám phá Bà Nà Hills và phố cổ Hội An', status: 'pending' },
      { id: 3, title: 'Tour Phú Quốc', description: 'Nghỉ dưỡng đảo ngọc 4 ngày 3 đêm', status: 'completed' },
      { id: 4, title: 'Tour Sapa', description: 'Trekking và homestay bản địa', status: 'active' },
    ]
    
    setItems(mockData)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter items by search
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'completed': return '#6366f1'
      default: return '#94a3b8'
    }
  }

  return (
    <div 
      className={`${styles.app} ${darkMode ? styles.dark : ''}`}
      style={{ '--primary-color': primaryColor } as React.CSSProperties}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.appName}>{appName}</h1>
          
          <div className={styles.headerActions}>
            {features?.enableSearch && (
              <input
                type="search"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            )}
            
            {features?.enableDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={styles.darkModeToggle}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Sidebar Navigation */}
        {menuItems && menuItems.length > 0 && (
          <nav className={styles.sidebar}>
            <ul className={styles.menuList}>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    className={`${styles.menuItem} ${activeMenu === item.href ? styles.active : ''}`}
                    onClick={() => setActiveMenu(item.href)}
                  >
                    {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Main Content */}
        <main className={styles.main}>
          {appDescription && (
            <p className={styles.description}>{appDescription}</p>
          )}

          {/* API Status */}
          {apiConfig?.endpoint && (
            <div className={styles.apiStatus}>
              <span className={styles.statusDot}></span>
              Connected to: {apiConfig.endpoint}
            </div>
          )}

          {/* Data Grid */}
          <div className={styles.dataSection}>
            <div className={styles.sectionHeader}>
              <h2>Dashboard</h2>
              <button onClick={fetchData} className={styles.refreshButton} disabled={loading}>
                {loading ? '⏳' : '🔄'} Refresh
              </button>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className={styles.dataGrid}>
                {filteredItems.length === 0 ? (
                  <p className={styles.noData}>Không tìm thấy dữ liệu</p>
                ) : (
                  filteredItems.map(item => (
                    <div key={item.id} className={styles.dataCard}>
                      <div className={styles.cardHeader}>
                        <h3>{item.title}</h3>
                        <span 
                          className={styles.statusBadge}
                          style={{ backgroundColor: getStatusColor(item.status) }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p>{item.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default BasicWebApp
