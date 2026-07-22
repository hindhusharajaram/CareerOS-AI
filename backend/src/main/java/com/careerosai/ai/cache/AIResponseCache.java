package com.careerosai.ai.cache;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AIResponseCache {

    private static class CacheEntry {
        final Object data;
        final Instant expiresAt;

        CacheEntry(final Object data, final long ttlSeconds) {
            this.data = data;
            this.expiresAt = Instant.now().plusSeconds(ttlSeconds);
        }

        boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private static final long DEFAULT_TTL_SECONDS = 300; // 5 minutes

    public void put(final String key, final Object data) {
        cache.put(key, new CacheEntry(data, DEFAULT_TTL_SECONDS));
    }

    public Object get(final String key) {
        final CacheEntry entry = cache.get(key);
        if (entry == null) return null;
        if (entry.isExpired()) {
            cache.remove(key);
            return null;
        }
        return entry.data;
    }

    public void clear() {
        cache.clear();
    }
}
