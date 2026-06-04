'use client';

import React from 'react';
import { TemplateData } from '@/lib/templates/types';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

interface Props {
  data: TemplateData;
  qrDataUrl?: string;
  publicUrl?: string;
  brideName?: string | null;
  groomName?: string | null;
  weddingDate?: string | Date | null;
  venueName?: string | null;
  venueAddress?: string | null;
}

/**
 * مكوّن مخصص للطباعة و PDF
 * أبعاد A4: 794 × 1123 px @ 96dpi
 * المقياس يضمن ملاءمة الكنفاس (800×1200) داخل A4
 */
export default function PrintInvitation({
  data,
  qrDataUrl,
  publicUrl,
  brideName,
  groomName,
  weddingDate,
  venueName,
  venueAddress
}: Props) {
  // ملاءمة 800x1200 داخل A4 (794x1123 مع padding)
  const targetW = 750;
  const targetH = 1050;
  const scale = Math.min(targetW / data.canvas.width, targetH / data.canvas.height);

  const dateStr = weddingDate
    ? new Date(weddingDate).toLocaleString('ar-EG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : null;

  return (
    <div className="print-page" dir="rtl">
      <div className="invitation-card">
        <TemplateRenderer data={data} scale={scale} />
      </div>

      <div className="info-section">
        <div className="names">
          {groomName && brideName ? (
            <h1>
              {groomName} <span className="amp">&</span> {brideName}
            </h1>
          ) : (
            <h1>دعوة زفاف</h1>
          )}
        </div>

        {dateStr && (
          <div className="info-row">
            <strong>التاريخ:</strong> {dateStr}
          </div>
        )}
        {venueName && (
          <div className="info-row">
            <strong>المكان:</strong> {venueName}
          </div>
        )}
        {venueAddress && (
          <div className="info-row">
            <strong>العنوان:</strong> {venueAddress}
          </div>
        )}

        {qrDataUrl && publicUrl && (
          <div className="qr-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR" className="qr-img" />
            <div className="qr-caption">
              <div>امسح الكود لفتح الدعوة الرقمية</div>
              <div className="qr-url">{publicUrl}</div>
            </div>
          </div>
        )}

        <div className="footer">
          صُمّمت بواسطة <strong>تحفة</strong> — دعوات أعراس بلمسة فاخرة
        </div>
      </div>

      <style jsx>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }

        .print-page {
          width: 794px;
          min-height: 1123px;
          margin: 0 auto;
          background: #ffffff;
          color: #1a1a1a;
          padding: 20px;
          box-sizing: border-box;
          font-family: 'Amiri', 'Noto Naskh Arabic', serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .invitation-card {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          border: 1px solid rgba(201, 168, 76, 0.25);
          border-radius: 12px;
          overflow: hidden;
        }

        .info-section {
          width: 100%;
          max-width: 720px;
          padding: 16px 24px;
          border-top: 2px solid #c9a84c;
          border-bottom: 2px solid #c9a84c;
          background: linear-gradient(135deg, #fbf6e6 0%, #ffffff 100%);
          border-radius: 12px;
          margin-top: 8px;
        }

        .names h1 {
          text-align: center;
          font-size: 28px;
          color: #8c6d1f;
          margin: 0 0 12px 0;
        }
        .amp {
          color: #c9a84c;
          font-size: 32px;
        }

        .info-row {
          margin: 6px 0;
          font-size: 14px;
          color: #3d3013;
          line-height: 1.7;
        }
        .info-row strong {
          color: #8c6d1f;
        }

        .qr-block {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px dashed rgba(201, 168, 76, 0.4);
        }

        .qr-img {
          width: 110px;
          height: 110px;
          border-radius: 8px;
          background: #ffffff;
          padding: 4px;
          border: 1px solid #e5dcc4;
        }

        .qr-caption {
          flex: 1;
          font-size: 13px;
          color: #5e4b1e;
          line-height: 1.7;
        }

        .qr-url {
          margin-top: 4px;
          font-size: 11px;
          color: #a88a3a;
          word-break: break-all;
          font-family: monospace;
        }

        .footer {
          text-align: center;
          margin-top: 12px;
          font-size: 11px;
          color: #a88a3a;
        }

        @media print {
          body {
            background: #ffffff !important;
            margin: 0 !important;
          }
          .print-page {
            box-shadow: none;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
