// 📁 ExportPDF.tsx
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '75%',
    height: '75%',
  },
  titlePage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 700,
  },
});

export const ExportPDF: React.FC<{ images: string[], bundleTitle?: string }> = ({ images, bundleTitle }) => (
  <Document>
    {bundleTitle && (
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.titlePage}>
          <Text style={styles.titleText}>{bundleTitle}</Text>
        </View>
      </Page>
    )}
    {images.map((src, idx) => (
      <Page size="A4" orientation="landscape" style={styles.page} key={idx}>
        <Image src={src} style={styles.image} />
      </Page>
    ))}
  </Document>
);

export const ExportPDFViewer: React.FC<{ images: string[], bundleTitle?: string }> = ({ images, bundleTitle }) => (
  <PDFViewer width="100%" height={800} showToolbar style={{ backgroundColor: "white" }}>
    <ExportPDF images={images} bundleTitle={bundleTitle} />
  </PDFViewer>
);
