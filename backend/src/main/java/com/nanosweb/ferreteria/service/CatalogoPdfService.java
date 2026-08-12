package com.nanosweb.ferreteria.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.nanosweb.ferreteria.model.Categoria;
import com.nanosweb.ferreteria.model.Producto;
import com.nanosweb.ferreteria.repository.CategoriaRepository;
import com.nanosweb.ferreteria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogoPdfService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Value("${app.catalog-pdf-path}")
    private String catalogPdfPath;

    public String generateCatalog() throws IOException {
        Path pdfPath = Paths.get(catalogPdfPath);
        Files.createDirectories(pdfPath.getParent());

        Document document = new Document(PageSize.A4, 36, 36, 54, 36);

        try {
            PdfWriter.getInstance(document, new FileOutputStream(pdfPath.toFile()));
            document.open();

            // Header
            Font titleFont = new Font(Font.HELVETICA, 24, Font.BOLD, new Color(30, 58, 95));
            Font subtitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL, new Color(100, 100, 100));
            Font catFont = new Font(Font.HELVETICA, 16, Font.BOLD, new Color(249, 115, 22));
            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
            Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.BLACK);

            Paragraph title = new Paragraph("NANO'S FERRETERÍA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Catálogo de Productos - " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            document.add(new Paragraph("\n"));

            NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("es", "AR"));

            List<Categoria> categorias = categoriaRepository.findByCategoriaPadreIsNullAndActivoTrueOrderByNombreAsc();

            for (Categoria categoria : categorias) {
                Paragraph catTitle = new Paragraph(categoria.getNombre().toUpperCase(), catFont);
                catTitle.setSpacingBefore(15);
                catTitle.setSpacingAfter(8);
                document.add(catTitle);

                List<Producto> productos = productoRepository.findByCategoriaIdAndActivoTrueAndIdNot(
                        categoria.getId(), 0L, null);

                if (productos.isEmpty()) continue;

                PdfPTable table = new PdfPTable(new float[]{1.5f, 4f, 1.5f, 1.5f, 1f});
                table.setWidthPercentage(100);

                // Header row
                Color headerBg = new Color(30, 58, 95);
                addHeaderCell(table, "SKU", headerFont, headerBg);
                addHeaderCell(table, "Producto", headerFont, headerBg);
                addHeaderCell(table, "Precio Min.", headerFont, headerBg);
                addHeaderCell(table, "Precio May.", headerFont, headerBg);
                addHeaderCell(table, "Stock", headerFont, headerBg);

                boolean alternate = false;
                for (Producto p : productos) {
                    Color bg = alternate ? new Color(245, 245, 245) : Color.WHITE;
                    addCell(table, p.getSku() != null ? p.getSku() : "-", cellFont, bg);
                    addCell(table, p.getNombre(), cellFont, bg);
                    addCell(table, currencyFormat.format(p.getPrecioMinorista()), cellFont, bg);
                    addCell(table, p.getPrecioMayorista() != null ? currencyFormat.format(p.getPrecioMayorista()) : "-", cellFont, bg);
                    addCell(table, String.valueOf(p.getStock()), cellFont, bg);
                    alternate = !alternate;
                }

                document.add(table);
            }

            // Footer
            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Precios sujetos a cambios sin previo aviso. Consulte disponibilidad.", subtitleFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

        } catch (DocumentException e) {
            throw new IOException("Error generando PDF: " + e.getMessage(), e);
        } finally {
            document.close();
        }

        log.info("Catálogo PDF generado en: {}", catalogPdfPath);
        return catalogPdfPath;
    }

    public Path getCatalogPath() {
        return Paths.get(catalogPdfPath);
    }

    private void addHeaderCell(PdfPTable table, String text, Font font, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, Font font, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setPadding(5);
        table.addCell(cell);
    }
}
