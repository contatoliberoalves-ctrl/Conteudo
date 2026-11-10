package com.liberofilho.concursos;

import android.Manifest;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/** Abre o Concurso com Líbero (assets/www/index.html) numa WebView. */
public class MainActivity extends Activity {
    private static final int PEDIDO_ARQUIVOS = 1;
    private FrameLayout raiz;
    private WebView web;
    private String[] pdfPendente;

    @Override
    protected void onCreate(Bundle estado) {
        super.onCreate(estado);
        raiz = new FrameLayout(this);
        web = new WebView(this);
        raiz.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(raiz);

        // Tela de ponta a ponta: o conteúdo fica entre as barras do sistema e acima do teclado.
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            raiz.setOnApplyWindowInsetsListener((v, ins) -> {
                android.graphics.Insets b = ins.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime() | WindowInsets.Type.displayCutout());
                v.setPadding(b.left, b.top, b.right, b.bottom);
                return WindowInsets.CONSUMED;
            });
        }

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        web.addJavascriptInterface(new Ponte(), "AndroidApp");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("file".equals(u.getScheme())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignorado) { }
                return true;
            }
        });

        // Botão voltar: o Android 13+ usa este callback; o Android 16 não chama mais onBackPressed.
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::voltar);
        }

        if (estado != null) web.restoreState(estado);
        else web.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    protected void onSaveInstanceState(Bundle saida) {
        super.onSaveInstanceState(saida);
        web.saveState(saida);
    }

    @Override
    protected void onPause() { super.onPause(); web.evaluateJavascript("window.appPausou&&window.appPausou()", null); }

    @Override
    protected void onResume() { super.onResume(); web.evaluateJavascript("window.appVoltou&&window.appVoltou()", null); }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() { voltar(); }

    /** Pergunta à página se ela tem para onde voltar; se não, manda o app para segundo plano. */
    private void voltar() {
        web.evaluateJavascript("(window.voltarAndroid && window.voltarAndroid()) ? 'sim' : 'nao'", v -> {
            if (v == null || !v.contains("sim")) moveTaskToBack(true);
        });
    }

    private void aviso(String msg) {
        runOnUiThread(() -> Toast.makeText(this, msg, Toast.LENGTH_LONG).show());
    }

    private void gravarPdf(String arquivo, String nome) {
        try (InputStream in = getAssets().open("www/colecao/" + arquivo)) {
            OutputStream out;
            if (Build.VERSION.SDK_INT >= 29) {
                ContentValues cv = new ContentValues();
                cv.put(MediaStore.MediaColumns.DISPLAY_NAME, nome);
                cv.put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
                cv.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                if (uri == null) throw new Exception("sem destino");
                out = getContentResolver().openOutputStream(uri);
            } else {
                File pasta = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                pasta.mkdirs();
                out = new FileOutputStream(new File(pasta, nome));
            }
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            out.close();
            aviso("PDF salvo na pasta Downloads.");
        } catch (Exception e) {
            aviso("Não foi possível salvar o PDF.");
        }
    }

    @Override
    public void onRequestPermissionsResult(int pedido, String[] perms, int[] res) {
        super.onRequestPermissionsResult(pedido, perms, res);
        if (pedido != PEDIDO_ARQUIVOS || pdfPendente == null) return;
        String[] p = pdfPendente;
        pdfPendente = null;
        if (res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED) new Thread(() -> gravarPdf(p[0], p[1])).start();
        else aviso("Sem a permissão de arquivos, o PDF não pode ser salvo.");
    }

    /** Ponte chamada pelo JavaScript da página (window.AndroidApp). */
    private class Ponte {
        @JavascriptInterface
        public void salvarPdf(String arquivo, String nome) {
            if (arquivo == null || nome == null || arquivo.contains("/") || arquivo.contains("..") || nome.contains("/") || nome.contains("..")) return;
            if (Build.VERSION.SDK_INT < 29 && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                pdfPendente = new String[]{arquivo, nome};
                runOnUiThread(() -> requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, PEDIDO_ARQUIVOS));
                return;
            }
            gravarPdf(arquivo, nome);
        }

        /** A página avisa a cor do fundo e se está no tema escuro, para as barras do sistema acompanharem. */
        @JavascriptInterface
        public void cores(String fundo, boolean escuro) {
            runOnUiThread(() -> {
                try { raiz.setBackgroundColor(Color.parseColor(fundo)); } catch (Exception ignorado) { }
                if (Build.VERSION.SDK_INT >= 30) {
                    WindowInsetsController c = getWindow().getInsetsController();
                    if (c != null) {
                        int claras = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                        c.setSystemBarsAppearance(escuro ? 0 : claras, claras);
                    }
                } else if (Build.VERSION.SDK_INT >= 26) {
                    int f = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    View d = getWindow().getDecorView();
                    d.setSystemUiVisibility(escuro ? d.getSystemUiVisibility() & ~f : d.getSystemUiVisibility() | f);
                }
            });
        }
    }
}
