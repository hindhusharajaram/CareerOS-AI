package com.careerosai.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

@Service
public class ResumeParsingService {

    private final Tika tika = new Tika();

    public String extractTextFromResume(MultipartFile file) {
        String extractedText = "";

        // Attempt 1: Apache Tika Extraction
        try (InputStream inputStream = file.getInputStream()) {
            extractedText = tika.parseToString(inputStream);
        } catch (Exception e) {
            System.err.println("Tika parsing failed: " + e.getMessage());
        }

        // Attempt 2: PDFBox Fallback if Tika extracted empty/short string
        if (extractedText == null || extractedText.trim().length() < 50) {
            try (InputStream inputStream = file.getInputStream();
                 PDDocument document = PDDocument.load(inputStream)) {
                PDFTextStripper stripper = new PDFTextStripper();
                extractedText = stripper.getText(document);
            } catch (Exception e) {
                System.err.println("PDFBox fallback parsing failed: " + e.getMessage());
            }
        }

        // Clean up whitespace & control characters
        return extractedText != null ? extractedText.replaceAll("\\s+", " ").trim() : "";
    }
}
