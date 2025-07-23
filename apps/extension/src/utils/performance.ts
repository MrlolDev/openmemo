// Performance monitoring and optimization utilities
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private memoryBaseline: number | null = null;
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Measure execution time of a function
   */
  measure<T>(name: string, fn: () => T): T {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration);
    
    if (duration > 100) { // Log slow operations
      console.warn(`OpenMemo: Slow operation "${name}": ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  /**
   * Measure async function execution time
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration);
    
    if (duration > 200) { // Higher threshold for async operations
      console.warn(`OpenMemo: Slow async operation "${name}": ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number): void {
    if (!this.isEnabled) return;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements to prevent memory leaks
    if (values.length > 100) {
      values.shift();
    }
  }

  /**
   * Monitor memory usage
   */
  checkMemoryUsage(operation: string): void {
    if (!this.isEnabled || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const currentUsage = memory.usedJSHeapSize / 1024 / 1024; // MB

    if (this.memoryBaseline === null) {
      this.memoryBaseline = currentUsage;
    }

    const increase = currentUsage - this.memoryBaseline;
    
    if (increase > 10) { // Warn if memory increased by >10MB
      console.warn(`OpenMemo: High memory usage after "${operation}": ${currentUsage.toFixed(2)}MB (+${increase.toFixed(2)}MB)`);
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): Record<string, { avg: number; min: number; max: number; count: number }> {
    if (!this.isEnabled) return {};

    const stats: Record<string, { avg: number; min: number; max: number; count: number }> = {};

    for (const [name, values] of this.metrics.entries()) {
      if (values.length === 0) continue;

      stats[name] = {
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    }

    return stats;
  }

  /**
   * Log performance report
   */
  report(): void {
    if (!this.isEnabled) return;

    const stats = this.getStats();
    if (Object.keys(stats).length === 0) return;

    console.group('OpenMemo Performance Report');
    
    for (const [name, stat] of Object.entries(stats)) {
      console.log(`${name}: avg=${stat.avg.toFixed(2)}ms, min=${stat.min.toFixed(2)}ms, max=${stat.max.toFixed(2)}ms, count=${stat.count}`);
    }
    
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`Memory: used=${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB, limit=${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    }
    
    console.groupEnd();
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.memoryBaseline = null;
  }
}

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      timeout = null;
      func.apply(null, args);
    }, wait);
  };
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  let previous = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(null, args);
    } else if (!timeout) {
      timeout = window.setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(null, args);
      }, remaining);
    }
  };
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-report performance stats every 30 seconds in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    performanceMonitor.report();
  }, 30000);
}