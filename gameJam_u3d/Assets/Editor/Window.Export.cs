using UnityEngine;
using UnityEngine.SceneManagement;

using UnityEditor;
using UnityEditorInternal;
using UnityEditor.SceneManagement;

using System.Collections;
using System.Collections.Generic;
using System.IO;

using Newtonsoft.Json;

namespace exsdk {
  public class GLTFExportWindow : EditorWindow {
    public string outputPath = "";
    public string projectName = "";
    public FileMode mode = FileMode.Mixed;
    public List<SceneAsset> scenes;
    public List<Object> dirsForCollectScenes;
    private Vector2 scrollPos = Vector2.zero;

    ReorderableList uiCollectScenes = null;
    ReorderableList uiScenes = null;
    bool jsonDirty = false;

    [MenuItem("Window/u3d-exporter")]
    static void Open() {
      GLTFExportWindow window = (GLTFExportWindow)EditorWindow.GetWindow(typeof(GLTFExportWindow));
      window.titleContent = new GUIContent("u3d-exporter");
      window.minSize = new Vector2(200, 200);
      window.Show();
    }

    void OnEnable() {
      string projectPath = Path.GetDirectoryName(Application.dataPath);
      string settingsPath = Path.Combine(projectPath, "u3d-exporter.json");

      // read u3d-exporter.json
      JSON_ExportSettings settings = null;
      try {
        using (StreamReader r = new StreamReader(settingsPath)) {
          string json = r.ReadToEnd();
          settings = JsonConvert.DeserializeObject<JSON_ExportSettings>(json);
        }
      } catch (System.Exception) {
        settings = new JSON_ExportSettings();
      }

      // outputPath
      this.outputPath = settings.outputPath;
      if (string.IsNullOrEmpty(this.outputPath)) {
        this.outputPath = projectPath;
      }

      // projectName
      this.projectName = settings.projectName;
      if (string.IsNullOrEmpty(this.projectName)) {
        this.projectName = "out";
      }

      // collect scenes

      dirsForCollectScenes = new List<Object>();
      for (int i = 0; i < settings.dirsForCollectScenes.Count; ++i) {
        string dirPath = AssetDatabase.GUIDToAssetPath(settings.dirsForCollectScenes[i]);
        Object asset = AssetDatabase.LoadAssetAtPath(dirPath, typeof(Object));
        if (asset) {
          this.dirsForCollectScenes.Add(asset);
        }
      }

      this.uiCollectScenes = new ReorderableList(dirsForCollectScenes, typeof(Object), true, true, true, true);
      this.uiCollectScenes.drawHeaderCallback = (Rect rect) => {
        EditorGUI.LabelField(rect, "CollectScenes:", EditorStyles.boldLabel);
      };

      this.uiCollectScenes.drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) => {
        object asset = this.uiCollectScenes.list[index];
        rect.y += 2;
        rect.height = EditorGUIUtility.singleLineHeight;
        EditorGUI.BeginChangeCheck();
        asset = EditorGUI.ObjectField(rect, dirsForCollectScenes[index], typeof(Object), false);
        if (EditorGUI.EndChangeCheck()) {
          this.uiCollectScenes.list[index] = asset;
          this.jsonDirty = true;
        }
      };

      this.uiCollectScenes.onChangedCallback = (ReorderableList list) => {
        this.jsonDirty = true;
      };

      // scenes
      scenes = new List<SceneAsset>();
      for (int i = 0; i < settings.scenes.Count; ++i) {
        string scenePath = AssetDatabase.GUIDToAssetPath(settings.scenes[i]);
        SceneAsset asset = AssetDatabase.LoadAssetAtPath(scenePath, typeof(SceneAsset)) as SceneAsset;
        if (asset) {
          this.scenes.Add(asset);
        }
      }

      this.uiScenes = new ReorderableList(this.scenes, typeof(SceneAsset), true, true, true, true);
      this.uiScenes.drawHeaderCallback = (Rect rect) => {
        EditorGUI.LabelField(rect, "Scenes:", EditorStyles.boldLabel);
      };

      this.uiScenes.drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) => {
        object asset = this.uiScenes.list[index];
        rect.y += 2;
        rect.height = EditorGUIUtility.singleLineHeight;

        EditorGUI.BeginChangeCheck();
        asset = EditorGUI.ObjectField(rect, asset as Object, typeof(SceneAsset), false);
        if (EditorGUI.EndChangeCheck()) {
          this.uiScenes.list[index] = asset;
          this.jsonDirty = true;
        }
      };

      this.uiScenes.onChangedCallback = (ReorderableList list) => {
        this.jsonDirty = true;
      };

      this.Repaint();
    }

    void Export() {
      #if UNITY_STANDALONE
        Exporter exporter = new Exporter();
        exporter.outputPath = this.outputPath;
        exporter.name = this.projectName;
        exporter.mode = this.mode;
        exporter.scenes = this.scenes;

        exporter.Exec();
      #else
        EditorUtility.DisplayDialog("Error", "Your build target must be set to standalone", "Okay");
        return;
      #endif
    }

    void Browse() {
      string result = EditorUtility.OpenFolderPanel("Choose your export Directory", outputPath, "");
      if (string.IsNullOrEmpty(result) == false) {
        this.outputPath = result;

        this.jsonDirty = true;

        this.Repaint();
      }

      GUIUtility.ExitGUI();
    }

    void Explore(string path) {
      bool openInsidesOfFolder = false;

      if (SystemInfo.operatingSystem.IndexOf("Windows") != -1) {
        string winPath = path.Replace("/", "\\");

        if (System.IO.Directory.Exists(winPath)) {
          openInsidesOfFolder = true;
        }

        try {
          System.Diagnostics.Process.Start(
            "explorer.exe", (openInsidesOfFolder ? "/root," : "/select,") + winPath
          );
        } catch (System.ComponentModel.Win32Exception e) {
          e.HelpLink = "";
        }
      } else {
        if (System.IO.Directory.Exists(path)) {
          openInsidesOfFolder = true;
        }

        string arguments = (openInsidesOfFolder ? "" : "-R ") + path;

        try {
          System.Diagnostics.Process.Start("open", arguments);
        } catch (System.ComponentModel.Win32Exception e) {
          e.HelpLink = "";
        }
      }
    }

    List<SceneAsset> CollectScenes() {
      List<SceneAsset> scenes = new List<SceneAsset>();
      foreach (var dir in this.dirsForCollectScenes) {
        string dirPath = AssetDatabase.GetAssetPath(dir);
        if (!Directory.Exists(dirPath)) {
          Debug.LogWarning(dirPath + " is not directory");
          continue;
        }

        string[] files = Directory.GetFiles(dirPath);
        foreach (var file in files) {
          SceneAsset scene = AssetDatabase.LoadAssetAtPath<SceneAsset>(file);
          if (scene && !scenes.Contains(scene)) {
            scenes.Add(scene);
          }
        }

        string[] dirs = Directory.GetDirectories(dirPath);
        foreach (var item in dirs) {
          Utils.RecurseDir(item, (path) => {
            path = path.Replace('\\', '/');
            string[] filesGo = Directory.GetFiles(path);
            for (int i = 0; i < filesGo.Length; i++) {
              SceneAsset sceneGo = AssetDatabase.LoadAssetAtPath<SceneAsset>(filesGo[i]);
              if (sceneGo && !scenes.Contains(sceneGo)) {
                scenes.Add(sceneGo);
              }
            }

            return true;
          });
        }
      }

      return scenes;
    }

    void OnGUI() {
      scrollPos = EditorGUILayout.BeginScrollView(scrollPos, GUILayout.ExpandWidth(true), GUILayout.ExpandHeight(true));
      EditorGUIUtility.labelWidth = 100.0f;
      // EditorGUIUtility.fieldWidth = fieldWidth;

      // =========================
      // Options
      // =========================

      GUILayout.Label("Options", EditorStyles.boldLabel);

      // #########################
      // Start
      // #########################

      GUIStyle style = EditorStyles.inspectorDefaultMargins;
      EditorGUILayout.BeginVertical(style, new GUILayoutOption[0]);

      // =========================
      // Output Path
      // =========================

      EditorGUILayout.LabelField("Project:", EditorStyles.boldLabel);

      string outputPath = EditorGUILayout.TextField("Output Path", this.outputPath);
      if (outputPath != this.outputPath) {
        this.outputPath = outputPath;
        this.jsonDirty = true;
      }

      // =========================
      // Browse
      // =========================

      EditorGUILayout.BeginHorizontal(new GUILayoutOption[0]);
      GUILayout.FlexibleSpace();
      if (GUILayout.Button("Open...", GUILayout.MaxWidth(80))) {
        this.Explore(this.outputPath);
      }
      if (GUILayout.Button("Browse...", GUILayout.MaxWidth(80))) {
        this.Browse();
      }
      EditorGUILayout.EndHorizontal();
      EditorGUILayout.Space();

      // =========================
      // Project Name
      // =========================

      string projName = EditorGUILayout.TextField("Project Name", this.projectName);
      if (projName != this.projectName) {
        this.projectName = projName;
        this.jsonDirty = true;
      }

      // =========================
      // Mode
      // =========================

      this.mode = (FileMode)EditorGUILayout.EnumPopup("Mode", this.mode);
      EditorGUILayout.Space();

      // =========================
      // Collect the scenes
      // =========================

      if (this.uiCollectScenes != null) {
        this.uiCollectScenes.DoLayoutList();
      }

      EditorGUILayout.BeginHorizontal(new GUILayoutOption[0]);
      GUILayout.FlexibleSpace();
      if (GUILayout.Button("Collection", "LargeButton", GUILayout.MaxWidth(200))) {
        List<SceneAsset> scenes = this.CollectScenes();
        if (scenes != null && scenes.Count > 0) {
          for (int i = 0; i < scenes.Count; i++) {
            if (!this.uiScenes.list.Contains(scenes[i])) {
              this.uiScenes.list.Add(scenes[i]);
            }
          }

          this.jsonDirty = true;
        }
      }

      GUILayout.FlexibleSpace();
      EditorGUILayout.EndHorizontal();
      EditorGUILayout.Space();
      EditorGUILayout.BeginHorizontal(new GUILayoutOption[0]);
      GUILayout.FlexibleSpace();
      if (GUILayout.Button("Clear", "LargeButton", GUILayout.MaxWidth(200))) {
        this.uiCollectScenes.list.Clear();
        this.jsonDirty = true;
      }

      GUILayout.FlexibleSpace();
      EditorGUILayout.EndHorizontal();
      EditorGUILayout.Space();

      // =========================
      // Scenes
      // =========================

      if (this.uiScenes != null) {
        this.uiScenes.DoLayoutList();
      }

      EditorGUILayout.Space();
      EditorGUILayout.BeginHorizontal(new GUILayoutOption[0]);
      GUILayout.FlexibleSpace();
      if (GUILayout.Button("Clear", "LargeButton", GUILayout.MaxWidth(200))) {
        this.uiScenes.list.Clear();
        this.jsonDirty = true;
      }

      GUILayout.FlexibleSpace();
      EditorGUILayout.EndHorizontal();
      EditorGUILayout.Space();

      // =========================
      // Export Button
      // =========================

      GUILayout.Space(30);
      EditorGUILayout.BeginHorizontal(new GUILayoutOption[0]);
      EditorGUILayout.Space();
      GUILayout.FlexibleSpace();
      if (GUILayout.Button("Export", "LargeButton", GUILayout.MaxWidth(200))) {
        Metrics.post("onClick", "Click", "ExportButton");
        this.Export();
      }

      GUILayout.FlexibleSpace();
      EditorGUILayout.Space();
      EditorGUILayout.EndHorizontal();

      // #########################
      // End
      // #########################

      EditorGUILayout.EndVertical();

      if (this.jsonDirty) {
        JSON_ExportSettings settings = new JSON_ExportSettings();
        settings.projectName = this.projectName;
        settings.outputPath = this.outputPath;
        settings.mode = this.mode;

        for (int i = 0; i < this.dirsForCollectScenes.Count; ++i) {
          if (this.dirsForCollectScenes[i] == null) {
            continue;
          }
          string path = AssetDatabase.GetAssetPath(this.dirsForCollectScenes[i]);
          settings.dirsForCollectScenes.Add(AssetDatabase.AssetPathToGUID(path));
        }

        for (int i = 0; i < this.scenes.Count; ++i) {
          if (this.scenes[i] == null) {
            continue;
          }
          string path = AssetDatabase.GetAssetPath(this.scenes[i]);
          settings.scenes.Add(AssetDatabase.AssetPathToGUID(path));
        }

        // save json
        string json = JsonConvert.SerializeObject(settings, Formatting.Indented);
        string projectPath = Path.GetDirectoryName(Application.dataPath);
        string settingsPath = Path.Combine(projectPath, "u3d-exporter.json");
        StreamWriter writer = new StreamWriter(settingsPath);
        writer.Write(json);
        writer.Close();

        this.jsonDirty = false;
      }

      EditorGUILayout.EndScrollView();
    }
  }
}
