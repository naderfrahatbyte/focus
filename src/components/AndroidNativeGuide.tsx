import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import {
  Smartphone,
  ShieldAlert,
  Code,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Lock,
} from 'lucide-react';

export const AndroidNativeGuide: React.FC = () => {
  const { state } = useFocus();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const manifestSnippet = `<!-- 1. الصلاحيات المطلوبة في AndroidManifest.xml -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />

<application ...>
    <!-- خدمة كشف التطبيقات والحظر الفوري -->
    <service
        android:name=".FocusBlockerAccessibilityService"
        android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
        android:exported="true">
        <intent-filter>
            <action android:name="android.accessibilityservice.AccessibilityService" />
        </intent-filter>
        <meta-data
            android:name="android.accessibilityservice"
            android:resource="@xml/focus_accessibility_service" />
    </service>

    <!-- شاشة الحظر الكامل عند نفاد الرصيد -->
    <activity
        android:name=".BlockOverlayActivity"
        android:theme="@style/Theme.AppCompat.Translucent.NoTitleBar.Fullscreen"
        android:launchMode="singleInstance"
        android:excludeFromRecents="true" />
</application>`;

  const accessibilityConfigXml = `<!-- res/xml/focus_accessibility_service.xml -->
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="false"
    android:description="@string/focus_accessibility_desc" />`;

  const kotlinServiceCode = `// app/src/main/java/app/goals/FocusBlockerAccessibilityService.kt
package app.goals

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class FocusBlockerAccessibilityService : AccessibilityService() {

    // قائمة التطبيقات المستهلكة المحددة من قبلك
    private val blockedPackages = setOf(
        "com.twitter.android",
        "com.instagram.android",
        "com.zhiliaoapp.musically",
        "com.google.android.youtube",
        "com.supercell.clashroyale"
    )

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageName = event.packageName?.toString() ?: return

            // فحص الرصيد من SharedPreferences المخزن محلياً
            val prefs = getSharedPreferences("focus_prefs", MODE_PRIVATE)
            val currentCredits = prefs.getFloat("shared_credits", 0f)

            if (blockedPackages.contains(packageName) && currentCredits <= 0.05f) {
                // منع التطبيق فوراً وعرض شاشة الحظر
                val intent = Intent(this, BlockOverlayActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    putExtra("BLOCKED_PACKAGE", packageName)
                }
                startActivity(intent)
            }
        }
    }

    override fun onInterrupt() {}
}`;

  return (
    <div className="space-y-5">
      {/* Honest Technical Status Report */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1d1238] to-[#120a24] border border-amber-400/50 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              تقرير الحظر الفعلي على نظام أندرويد (الواقع التقني وخطة التنفيذ)
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              وفقاً لطلبك الصريح («أريد حظرًا حقيقيًا للتطبيقات الأخرى على Android عند نفاد الرصيد، وليس مجرد واجهة شكلية. افحص التقنية الحالية وحدد أقل تعديل ضروري. لا تدّعِ اكتمال الحظر إذا لم يكن يعمل فعليًا»)، إليك الحقيقة الهندسية الدقيقة:
            </p>
          </div>
        </div>

        {/* Technical Reality Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-[#140b26] border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              العائق التقني في تطبيقات الويب / المتصفح
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              لا يمكن لأي كود JavaScript أو صفحة ويب أو متصفح في أندرويد مراقبة التطبيقات الأخرى أو إغلاق تطبيق مثل إنستغرام أو تويتر بسبب عزل أندرويد الأمني (Sandboxing).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#140b26] border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              الحل الأصلي المطلوب في مشروع أندرويد المرفق
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              يحتاج مشروع Android المرفق إلى مكوّن واحد فقط (<span className="text-emerald-300 font-mono font-bold">AccessibilityService</span>) مع صلاحية (<span className="text-emerald-300 font-mono font-bold">SYSTEM_ALERT_WINDOW</span>) لتغطية التطبيق المقيد بشاشة قفل فورية بمجرد فتحه عندما يكون الرصيد 0.
            </p>
          </div>
        </div>
      </div>

      {/* Code integration steps */}
      <div className="bg-[#120c24] rounded-2xl border border-purple-900/30 p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" />
          الملفات الجاهزة للإضافة إلى مشروع أندرويد المرفق (أقل تعديل ضروري):
        </h3>

        {/* Step 1: Manifest */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>1. الصلاحيات والخدمة في AndroidManifest.xml</span>
            <button
              onClick={() => handleCopy('manifest', manifestSnippet)}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
            >
              {copiedKey === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'manifest' ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-[#090514] border border-purple-900/40 text-[11px] font-mono text-slate-300 overflow-x-auto text-left" dir="ltr">
            {manifestSnippet}
          </pre>
        </div>

        {/* Step 2: XML Config */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>2. إعدادات خدمة الوصول في res/xml/focus_accessibility_service.xml</span>
            <button
              onClick={() => handleCopy('xml', accessibilityConfigXml)}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
            >
              {copiedKey === 'xml' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'xml' ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-[#090514] border border-purple-900/40 text-[11px] font-mono text-slate-300 overflow-x-auto text-left" dir="ltr">
            {accessibilityConfigXml}
          </pre>
        </div>

        {/* Step 3: Kotlin Service */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>3. ملف الخدمة FocusBlockerAccessibilityService.kt</span>
            <button
              onClick={() => handleCopy('service', kotlinServiceCode)}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
            >
              {copiedKey === 'service' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'service' ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-[#090514] border border-purple-900/40 text-[11px] font-mono text-emerald-300 overflow-x-auto text-left" dir="ltr">
            {kotlinServiceCode}
          </pre>
        </div>

        {/* How communication works */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-amber-300">آلية مزامنة الرصيد بين واجهة الويب والخدمة الأصلية:</div>
          <p className="leading-relaxed">
            عند تشغيل هذا التطبيق داخل WebView في أندرويد (كما في مشروعك المرفق)، يقوم كود <span className="text-white font-mono">@JavascriptInterface</span> بتحديث قيمة <span className="text-amber-300 font-mono">shared_credits</span> في الـ SharedPreferences مباشرة عند كل عملية كسب أو استهلاك، مما يتيح لـ AccessibilityService التحقق اللحظي قبل فتح أي تطبيق مقيد.
          </p>
        </div>
      </div>
    </div>
  );
};
