package com.careerosai.service;

import com.careerosai.entity.MasterSkill;
import com.careerosai.entity.SkillAlias;
import com.careerosai.repository.MasterSkillRepository;
import com.careerosai.repository.SkillAliasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SkillNormalizationService {

    private final MasterSkillRepository masterSkillRepository;
    private final SkillAliasRepository skillAliasRepository;

    public String normalizeSkillName(final String rawSkillName) {
        if (rawSkillName == null || rawSkillName.isBlank()) {
            return rawSkillName;
        }
        final String trimmed = rawSkillName.trim();

        // 1. Exact Match against MasterSkill
        final Optional<MasterSkill> masterOpt = masterSkillRepository.findByNameIgnoreCase(trimmed);
        if (masterOpt.isPresent()) {
            return masterOpt.get().getName();
        }

        // 2. Alias Match
        final Optional<SkillAlias> aliasOpt = skillAliasRepository.findByAliasIgnoreCase(trimmed);
        if (aliasOpt.isPresent()) {
            return aliasOpt.get().getMasterSkill().getName();
        }

        // 3. Title Case Fallback
        return capitalizeWords(trimmed);
    }

    private String capitalizeWords(final String text) {
        if (text.length() <= 3) return text.toUpperCase();
        return Character.toUpperCase(text.charAt(0)) + text.substring(1).toLowerCase();
    }
}
