package com.flight.ticket.service;

import com.flight.ticket.model.CT_DatVe;
import com.flight.ticket.model.ChuyenBay;
import com.lowagie.text.Font;
import com.lowagie.text.*;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Currency;
import java.util.Locale;

@Service
public class TicketPdfService {

    private static final Color PRIMARY_COLOR = new Color(0, 51, 102); // Deep Blue
    private static final Color SECONDARY_COLOR = new Color(240, 240, 240); // Light Grey
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    public void generateTicketPdf(CT_DatVe ve, HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // --- FONTS (Support Vietnamese Unicode) ---
        BaseFont baseFont;
        BaseFont baseFontBold;
        try {
            // Loading Arial from Windows Fonts folder
            baseFont = BaseFont.createFont("C:\\Windows\\Fonts\\arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            baseFontBold = BaseFont.createFont("C:\\Windows\\Fonts\\arialbd.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        } catch (Exception e) {
            // Fallback to Helvetica if Arial is not found
            baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            baseFontBold = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        }

        Font fontTitle = new Font(baseFontBold, 22, Font.NORMAL, PRIMARY_COLOR);
        Font fontSubtitle = new Font(baseFontBold, 14, Font.NORMAL, Color.GRAY);
        Font fontLabel = new Font(baseFont, 10, Font.NORMAL, Color.DARK_GRAY);
        Font fontValue = new Font(baseFontBold, 12, Font.NORMAL, Color.BLACK);
        Font fontWhite = new Font(baseFontBold, 12, Font.NORMAL, Color.WHITE);
        Font fontTiny = new Font(baseFont, 8, Font.ITALIC, Color.GRAY);
        Font fontBrand = new Font(baseFontBold, 26, Font.NORMAL, PRIMARY_COLOR);
        Font fontBrandRed = new Font(baseFontBold, 26, Font.NORMAL, new Color(204, 0, 0));

        // --- HEADER ---
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{2, 1});

        // Logo and Brand
        PdfPCell logoCell = new PdfPCell();
        logoCell.setBorder(Rectangle.NO_BORDER);
        Phrase logoPhrase = new Phrase();
        logoPhrase.add(new Chunk("FLY", fontBrand));
        logoPhrase.add(new Chunk("VIET", fontBrandRed));
        logoCell.addElement(logoPhrase);
        logoCell.addElement(new Paragraph("Vé Điện Tử & Thẻ Lên Máy Bay", fontTiny));
        headerTable.addCell(logoCell);

        // Ticket ID
        PdfPCell idCell = new PdfPCell(new Paragraph("MÃ VÉ: " + ve.getMaVe(), fontSubtitle));
        idCell.setBorder(Rectangle.NO_BORDER);
        idCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        headerTable.addCell(idCell);

        document.add(headerTable);
        document.add(new Paragraph("\n"));

        // --- ROUTE BAR ---
        ChuyenBay cb = ve.getMaChuyenBay();
        String origin = (cb != null && cb.getMaSanBayDi() != null) ? cb.getMaSanBayDi().getThanhPho() : "UNKNOWN";
        String dest = (cb != null && cb.getMaSanBayDen() != null) ? cb.getMaSanBayDen().getThanhPho() : "UNKNOWN";
        String originCode = (cb != null && cb.getMaSanBayDi() != null) ? cb.getMaSanBayDi().getMaIATA() : "???";
        String destCode = (cb != null && cb.getMaSanBayDen() != null) ? cb.getMaSanBayDen().getMaIATA() : "???";

        PdfPTable routeTable = new PdfPTable(3);
        routeTable.setWidthPercentage(100);
        routeTable.setWidths(new float[]{1, 1, 1});

        routeTable.addCell(createRouteCell(originCode, origin, Element.ALIGN_LEFT, fontTitle, fontSubtitle));
        PdfPCell arrowCell = new PdfPCell(new Paragraph(">>", fontTitle));
        arrowCell.setBorder(Rectangle.NO_BORDER);
        arrowCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        arrowCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        routeTable.addCell(arrowCell);
        routeTable.addCell(createRouteCell(destCode, dest, Element.ALIGN_RIGHT, fontTitle, fontSubtitle));

        document.add(routeTable);
        document.add(new Paragraph("\n"));

        // --- MAIN TICKET CARD ---
        PdfPTable mainCard = new PdfPTable(2);
        mainCard.setWidthPercentage(100);
        mainCard.setSpacingBefore(10);

        // Header of Card
        PdfPCell cardHeader = new PdfPCell(new Phrase("THÔNG TIN CHUYẾN BAY", fontWhite));
        cardHeader.setBackgroundColor(PRIMARY_COLOR);
        cardHeader.setColspan(2);
        cardHeader.setPadding(8);
        cardHeader.setBorder(Rectangle.NO_BORDER);
        mainCard.addCell(cardHeader);

        // Row 1: Flight & Date
        addPremiumCell(mainCard, "Số hiệu chuyến bay", cb != null ? "VN-" + cb.getMaChuyenBay() : "N/A", fontLabel, fontValue);
        addPremiumCell(mainCard, "Ngày khởi hành", cb != null ? cb.getNgayGioKhoiHanh().format(DATE_FORMAT) : "N/A", fontLabel, fontValue);

        // Row 2: Time & Gate
        addPremiumCell(mainCard, "Giờ lên máy bay", cb != null ? cb.getNgayGioKhoiHanh().format(TIME_FORMAT) : "N/A", fontLabel, fontValue);
        addPremiumCell(mainCard, "Cửa", "GATE 01", fontLabel, fontValue);

        // Row 3: Seat & Class
        addPremiumCell(mainCard, "Số ghế", ve.getSoGhe() != null ? ve.getSoGhe() : "CHỜ XẾP", fontLabel, fontValue);
        addPremiumCell(mainCard, "Hạng vé", ve.getMaHangVe() != null ? ve.getMaHangVe().getTenHangVe() : "N/A", fontLabel, fontValue);

        // Row 4: Passenger Name & ID
        addPremiumCell(mainCard, "Họ tên hành khách", ve.getHoTenHK(), fontLabel, fontValue);
        addPremiumCell(mainCard, "CCCD / Hộ chiếu", ve.getCccd(), fontLabel, fontValue);

        document.add(mainCard);

        // --- PRICING SECTION ---
        document.add(new Paragraph("\n"));
        PdfPTable priceTable = new PdfPTable(1);
        priceTable.setWidthPercentage(40);
        priceTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

        NumberFormat vnFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        vnFormat.setCurrency(Currency.getInstance("VND"));
        
        PdfPCell priceCell = new PdfPCell();
        priceCell.setBackgroundColor(SECONDARY_COLOR);
        priceCell.setPadding(10);
        Paragraph p = new Paragraph("TỔNG TIỀN\n", fontLabel);
        p.add(new Chunk(vnFormat.format(ve.getGiaVe() != null ? ve.getGiaVe() : BigDecimal.ZERO), fontTitle));
        priceCell.addElement(p);
        priceTable.addCell(priceCell);
        
        document.add(priceTable);

        // --- FOOTER / TERMS ---
        document.add(new Paragraph("\n\n\n"));
        LineSeparator ls = new LineSeparator();
        ls.setLineColor(Color.LIGHT_GRAY);
        document.add(ls);
        
        Paragraph footer = new Paragraph("Lưu ý quan trọng:\n", fontLabel);
        footer.add(new Chunk("- Vui lòng có mặt tại sân bay 2 tiếng trước giờ khởi hành.\n", fontTiny));
        footer.add(new Chunk("- Mang theo vé này và CCCD/Hộ chiếu để làm thủ tục.\n", fontTiny));
        footer.add(new Chunk("- Cửa ra máy bay sẽ đóng 20 phút trước giờ khởi hành.\n", fontTiny));
        footer.add(new Chunk("- Cảm ơn quý khách đã lựa chọn FlyViet Airlines!", fontTiny));
        footer.setAlignment(Element.ALIGN_LEFT);
        document.add(footer);

        document.close();
    }

    private PdfPCell createRouteCell(String code, String city, int align, Font fontBig, Font fontSmall) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(align);
        
        Paragraph p = new Paragraph(code + "\n", fontBig);
        p.add(new Chunk(city, fontSmall));
        p.setAlignment(align);
        
        cell.addElement(p);
        return cell;
    }

    private void addPremiumCell(PdfPTable table, String label, String value, Font fLabel, Font fValue) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);
        cell.setBorderColor(Color.LIGHT_GRAY);
        
        Paragraph p = new Paragraph(label.toUpperCase() + "\n", fLabel);
        p.add(new Chunk(value != null ? value : "", fValue));
        
        cell.addElement(p);
        table.addCell(cell);
    }
}
