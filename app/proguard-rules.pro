# ============== 通用优化 ==============
-allowaccessmodification
-repackageclasses ''
-optimizationpasses 5
-mergeinterfacesaggressively
-overloadaggressively

# 保留行号信息，方便崩溃定位（Bugly/Logcat 需要）
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keepattributes RuntimeVisibleAnnotations,RuntimeVisibleParameterAnnotations
-keepattributes Exceptions

# ============== Kotlin 反射 / 元数据 ==============
-keep class kotlin.Metadata { *; }
-keepclassmembers class kotlin.Metadata { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.**

# ============== JNI / Native ==============
-keepclasseswithmembernames class * {
    native <methods>;
}
# 加载 JNI 库的 util 类
-keep class com.pengxh.daily.app.utils.DailyTask { *; }

# ============== Application / Activity / Service / Receiver / Provider ==============
-keep public class * extends android.app.Application
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends androidx.fragment.app.Fragment

# ============== 自定义 View（被 XML 反射构造） ==============
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}
-keepclassmembers class * extends android.view.View {
    public <init>(android.content.Context);
}

# ============== Enum（Retrofit/Gson 反序列化需要） ==============
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ============== Gson / Retrofit 序列化模型 ==============
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keepattributes Signature
-keepattributes Exceptions

# 所有 Model / Bean 保留字段，避免 Gson/Room 反射失败
-keep class com.pengxh.daily.app.model.** { *; }
-keep class com.pengxh.daily.app.sqlite.bean.** { *; }

# Retrofit
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class retrofit2.Response

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn org.conscrypt.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# ============== EventBus ==============
-keepattributes *Annotation*
-keepclassmembers class * {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }
-keepclassmembers class * extends org.greenrobot.eventbus.EventBusException { *; }
-dontwarn org.greenrobot.eventbus.**

# ============== Room ==============
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-keep @androidx.room.Dao class *
-dontwarn androidx.room.paging.**

# ============== Bugly ==============
-keep class com.tencent.bugly.** { *; }
-keep class com.tencent.mid.** { *; }
-dontwarn com.tencent.bugly.**

# ============== 邮件 / 第三方库 ==============
-keep class com.sun.mail.** { *; }
-keep class javax.mail.** { *; }
-keep class com.android.email.** { *; }
-dontwarn com.sun.mail.**
-dontwarn javax.mail.**

# WheelPicker / Gson
-keep class cn.qqtheme.framework.** { *; }
-dontwarn cn.qqtheme.framework.**

# ============== 内部 Event 数据类 ==============
-keep class com.pengxh.daily.app.utils.ApplicationEvent$* { *; }

# ============== 移除 Log（可选，进一步精简） ==============
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}
