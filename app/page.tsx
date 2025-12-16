// ShadCn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { SignInButton } from "@clerk/nextjs";
import { PricingTable } from "@clerk/nextjs";
// Icon
import {
    BookOpenCheckIcon,
    Brain,
    BrainCircuitIcon,
    FileSlidersIcon,
    SpeechIcon,
} from "lucide-react";
// Next
import Link from "next/link";
// React
import { Suspense } from "react";
// Component
import { UserAvatar } from "@/features/users/components/UserAvatar";

export default function LandingPage() {
    return (
        <div className="bg-linear-to-b from-background to-muted/20">
            <Navbar />
            <Hero />
            <Features />
            <DetailedFeatures />
            <Stats />
            <Testimonials />
            <Pricing />
            <Footer />
        </div>
    );
}

function Navbar() {
    return (
        <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <BrainCircuitIcon className="size-8 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">
                            Landr
                        </h1>
                    </div>
                    <Suspense
                        fallback={
                            <SignInButton forceRedirectUrl="/app">
                                <Button variant="outline">ورود</Button>
                            </SignInButton>
                        }
                    >
                        <NavButton />
                    </Suspense>
                </div>
            </div>
        </nav>
    );
}

async function NavButton() {
    const { userId } = await getCurrentUser();

    if (userId == null) {
        return (
            <SignInButton forceRedirectUrl="/app">
                <Button variant="outline">ورود</Button>
            </SignInButton>
        );
    }

    return (
        <Button asChild>
            <Link href="/app">داشبورد</Link>
        </Button>
    );
}

function Hero() {
    return (
        <section className="relative overflow-hidden py-20 sm:py-32">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
                        شغل رویایی خود را با{" "}
                        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent text-nowrap">
                            هوش مصنوعی
                        </span>{" "}
                        زودتر به دست بیاورید
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                        حدس و گمان را کنار بگذارید و جستجوی شغلی خود را تسریع
                        کنید. پلتفرم هوش مصنوعی ما اضطراب مصاحبه را از بین
                        می‌برد، رزومه شما را بهینه می‌کند و برتری فنی را برای
                        دریافت پیشنهادات سریع‌تر به شما می‌دهد.
                    </p>
                    <Button size="lg" className="h-12 px-6 text-base" asChild>
                        <Link href="/app">رایگان شروع کنید</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function Features() {
    const features = [
        {
            title: "تمرین مصاحبه با هوش مصنوعی",
            Icon: SpeechIcon,
            description:
                "مصاحبه‌های واقعی را با هوش مصنوعی که به پاسخ‌های شما تطبیق می‌یابد، شبیه‌سازی کنید. اعتماد به نفس بسازید و عصبی بودن را قبل از روز بزرگ از بین ببرید.",
        },
        {
            title: "پیشنهادات رزومه سفارشی",
            Icon: FileSlidersIcon,
            description:
                "رزومه خود را به یک سند ATS-friendly و تایید شده توسط استخدام‌کننده تبدیل کنید که تماس‌های بیشتری دریافت کنید.",
        },
        {
            title: "تمرین سوالات فنی",
            Icon: BookOpenCheckIcon,
            description:
                "مشکلات کدگذاری را با راهنمایی‌های هدایت شده و توضیحات حل کنید. رویکرد خود را به مصاحبه‌های فنی کامل کنید.",
        },
    ];
    return (
        <section className="py-20">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 mb-4 bg-primary/10 flex items-center justify-center rounded-lg">
                                    <feature.Icon className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-card-foreground">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DetailedFeatures() {
    return (
        <section className="py-20 bg-muted/20">
            <div className="container">
                <div className="text-center mb-16">
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        همه چیز که برای{" "}
                        <span className="text-primary">
                            موفقیت در مصاحبه‌های خود
                        </span>
                        نیاز دارید
                    </h3>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        تجربه عملی با سناریوهای مصاحبه واقعی، بازخورد شخصی‌سازی
                        شده و استراتژی‌های اثبات شده صنعت
                    </p>
                </div>

                <div className="space-y-20">
                    {/* AI Interview Practice */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <SpeechIcon className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-2xl font-bold text-foreground">
                                    تمرین مصاحبه با هوش مصنوعی
                                </h4>
                            </div>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                با مصاحبه‌کننده پیشرفته هوش مصنوعی ما تمرین کنید
                                که به پاسخ‌های شما تطبیق می‌یابد و بازخورد
                                لحظه‌ای ارائه می‌دهد. سناریوهای مصاحبه
                                واقع‌گرایانه برای سوالات رفتاری، فنی و مطالعه
                                موردی را تجربه کنید.
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    تعامل صوتی لحظه‌ای با مصاحبه‌کننده هوش
                                    مصنوعی
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    بازخورد شخصی‌سازی شده در سبک ارتباطی
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    بانک سوالات خاص صنعت
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    ردیابی پیشرفت و معیارهای بهبود
                                </li>
                            </ul>
                        </div>
                        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                            <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                        <Brain className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        مصاحبه‌کننده هوش مصنوعی
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    &quot;در مورد زمانی که مجبور بودید با یک عضو
                                    تیم دشوار کار کنید، بگویید...&quot;
                                </p>
                            </div>
                            <div className="bg-primary/5 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary">
                                            شما
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        پاسخ شما
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    &quot;در نقش قبلی‌ام، با یک همکار کار کردم
                                    که همیشه مهلت‌ها را از دست می‌داد...&quot;
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                        داستان‌گویی قوی
                                    </span>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                        ساختار خوب
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Optimization */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="lg:order-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <FileSlidersIcon className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-2xl font-bold text-foreground">
                                    تحلیل رزومه هوشمند
                                </h4>
                            </div>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                رزومه خود را با پیشنهادات مبتنی بر هوش مصنوعی که
                                برای سیستم‌های ATS و ترجیحات استخدام‌کننده
                                بهینه‌سازی می‌کنند، تبدیل کنید. بازخورد خاص و
                                عملی شخصی‌سازی شده برای نقش هدف و صنعت خود
                                دریافت کنید.
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    امتیازدهی و بهینه‌سازی سازگاری ATS
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    تحلیل تطابق شرح شغل
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    پیشنهادات کلمه کلیدی خاص صنعت
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    اندازه‌گیری تاثیر قبل/بعد
                                </li>
                            </ul>
                        </div>
                        <div className="lg:order-1 bg-card rounded-2xl p-6 border border-border shadow-lg">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-foreground">
                                        امتیاز رزومه
                                    </span>
                                    <span className="text-2xl font-bold text-primary">
                                        87%
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: "87%" }}
                                    ></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm text-foreground">
                                        سازگاری ATS
                                    </span>
                                    <span className="text-sm font-medium text-primary">
                                        عالی
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm text-foreground">
                                        تطابق کلمه کلیدی
                                    </span>
                                    <span className="text-sm font-medium text-primary">
                                        92%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm text-foreground">
                                        بیانیه‌های تاثیر
                                    </span>
                                    <span className="text-sm font-medium text-primary">
                                        خوب
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                                <p className="text-xs text-primary font-medium mb-1">
                                    💡 پیشنهاد
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    2 دستاورد کمی‌سازی شده دیگر اضافه کنید تا
                                    امتیاز تاثیر را افزایش دهید
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Questions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <BookOpenCheckIcon className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-2xl font-bold text-foreground">
                                    آماده‌سازی مصاحبه فنی
                                </h4>
                            </div>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                مصاحبه‌های کدگذاری را با پلتفرم تمرین جامع ما
                                مسلط شوید. راهنمایی مرحله به مرحله، نکات و
                                توضیحات مفصل برای مشکلات در همه سطوح دشواری و
                                موضوعات دریافت کنید.
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    1000+ مشکل کدگذاری انتخاب شده
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    اجرای و تست کد لحظه‌ای
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    نکات و توضیحات مبتنی بر هوش مصنوعی
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    الگوهای سوال خاص شرکت
                                </li>
                            </ul>
                        </div>
                        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                            <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">
                                        مجموع دو
                                    </span>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                        آسان
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    با توجه به یک آرایه از اعداد صحیح، شاخص‌های
                                    دو عدد که به هدف اضافه می‌شوند را برگردانید.
                                </p>
                                <div className="bg-background rounded p-2 font-mono text-xs">
                                    <span className="text-primary">def</span>{" "}
                                    <span className="text-foreground">
                                        twoSum
                                    </span>
                                    (
                                    <span className="text-primary">
                                        nums, target
                                    </span>
                                    ):
                                    <br />
                                    &nbsp;&nbsp;
                                    <span className="text-muted-foreground">
                                        # راه حل شما اینجا
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                <span className="text-primary">✓</span> 3/5
                                موارد تست گذرانده شد
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Stats() {
    const stats = [
        {
            value: "2.3x",
            label: "قرارگیری شغلی سریع‌تر",
            description:
                "کاربران ما پیشنهادات را در 4-6 هفته در مقابل میانگین صنعت 12+ هفته دریافت می‌کنند",
        },
        {
            value: "65%",
            label: "مصاحبه‌های کمتری نیاز است",
            description:
                "میانگین 3-4 مصاحبه برای دریافت پیشنهاد در مقابل 8-10 مصاحبه معمول",
        },
        {
            value: "89%",
            label: "نرخ موفقیت مصاحبه",
            description:
                "کاربرانی که برنامه آماده‌سازی ما را کامل می‌کنند، پیشنهادات را در 9/10 مصاحبه دریافت می‌کنند",
        },
        {
            value: "$15K+",
            label: "حقوق شروع بالاتر",
            description:
                "مهارت‌های مذاکره بهتر منجر به جبران خسارت بسیار بالاتر می‌شود",
        },
    ];

    return (
        <section className="py-20 bg-muted/30">
            <div className="container">
                <div className="text-center mb-16">
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        کاربران ما شغل‌ها را{" "}
                        <span className="text-primary">سریع‌تر و بهتر</span>
                        پیدا می‌کنند
                    </h3>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        فقط حرف ما را قبول نکنید. ببینید چگونه کاربران Landr به
                        طور مداوم در هر معیار مهمی از رقابت پیشی می‌گیرند.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300"
                        >
                            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                                {stat.value}
                            </div>
                            <div className="text-lg font-semibold text-foreground mb-3">
                                {stat.label}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-sm text-muted-foreground mb-8 text-pretty">
                        * بر اساس داده‌های داخلی از 2500+ قرارگیری شغلی موفق در
                        2024
                    </p>
                    <Button size="lg" className="h-12 px-6" asChild>
                        <Link href="/app">
                            به هزاران جستجوگر شغلی موفق بپیوندید
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "مهندس نرم‌افزار",
            company: "Google",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
            content:
                "Landr آماده‌سازی مصاحبه من را کاملاً تغییر داد. جلسات تمرین با هوش مصنوعی بسیار واقعی احساس می‌شدند که وارد مصاحبه Google خود شدم احساس کاملاً اعتماد به نفس داشتم. پیشنهاد را در اولین تلاش خود دریافت کردم!",
            timeToOffer: "3 هفته",
        },
        {
            name: "Marcus Rodriguez",
            role: "مدیر محصول",
            company: "Stripe",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
            content:
                "تا زمانی که Landr را پیدا کردم با سوالات رفتاری مشکل داشتم. هوش مصنوعی به من کمک کرد داستان‌های قانع‌کننده بسازم و تحویل خود را تمرین کنم. پیشنهادات از 3 شرکت مختلف دریافت کردم!",
            timeToOffer: "5 هفته",
        },
        {
            name: "Emily Park",
            role: "دانشمند داده",
            company: "Netflix",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
            content:
                "ویژگی تحلیل رزومه یک بازی‌ساز بود. نرخ تماس من پس از پیاده‌سازی پیشنهادات Landr سه برابر شد. ارزش هر پنی و بیشتر را دارد.",
            timeToOffer: "4 هفته",
        },
        {
            name: "Alex Thompson",
            role: "توسعه‌دهنده frontend",
            company: "Airbnb",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
            content:
                "تمرین سوالات فنی فوق‌العاده بود. از شکست در مصاحبه‌های کدگذاری به پیروزی در آنها رفتم. بازخورد هوش مصنوعی به من کمک کرد نقاط ضعف خود را شناسایی و بلافاصله رفع کنم.",
            timeToOffer: "2 هفته",
        },
        {
            name: "Priya Patel",
            role: "طراح UX",
            company: "Figma",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
            content:
                "من در حال تغییر شغلی به فناوری بودم و احساس غرق شدن داشتم. راهنمایی شخصی‌سازی شده Landr به من اعتماد به نفس داد تا برای نقش‌های طراحی درخواست دهم. اکنون رویای خود را در Figma زندگی می‌کنم!",
            timeToOffer: "6 هفته",
        },
        {
            name: "David Kim",
            role: "مهندس DevOps",
            company: "AWS",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
            content:
                "نکات مذاکره حقوق به تنهایی پلتفرم را 10 برابر پرداخت کرد. با پیروی از راهنمایی Landr، پیشنهاد خود را 25 هزار دلار افزایش دادم. قطعاً ارزشش را دارد!",
            timeToOffer: "4 هفته",
        },
    ];

    return (
        <section className="py-20">
            <div className="container">
                <div className="text-center mb-16">
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
                        داستان‌های موفقیت از{" "}
                        <span className="text-primary">کاربران واقعی</span>
                    </h3>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                        به هزاران حرفه‌ای که حرفه خود را با Landr تسریع
                        کرده‌اند، بپیوندید
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl h-full"
                        >
                            <CardContent className="p-6 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <UserAvatar
                                        className="size-10 shrink-0"
                                        name={testimonial.name}
                                        imageUrl={testimonial.avatar}
                                    />
                                    <div>
                                        <div className="font-semibold text-foreground">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>

                                <blockquote className="text-muted-foreground leading-relaxed mb-4 italic grow">
                                    &quot;{testimonial.content}&quot;
                                </blockquote>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-primary">
                                        @{testimonial.company}
                                    </div>
                                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                                        استخدام شده در {testimonial.timeToOffer}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-6">
                        آماده نوشتن داستان موفقیت خود هستید؟
                    </p>
                    <Button size="lg" className="h-12 px-8" asChild>
                        <Link href="/app">سفر خود را امروز شروع کنید</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    return (
        <section className="py-20 bg-muted/20">
            <div className="container">
                <div className="text-center mb-16">
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        طرح <span className="text-primary">تسریع شغلی</span> خود
                        را انتخاب کنید
                    </h3>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        در آینده خود با گزینه‌های قیمت‌گذاری انعطاف‌پذیر طراحی
                        شده برای اهداف شغلی و بودجه خود سرمایه‌گذاری کنید
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <PricingTable />
                </div>

                <div className="text-center mt-12">
                    <p className="text-sm text-muted-foreground mb-4">
                        همه طرح‌ها شامل دوره بازپرداخت 7 روزه هستند. هر زمان لغو
                        کنید.
                    </p>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="py-6 bg-card border-t border-border">
            <div className="container">
                <div className="text-center">
                    <p className="text-muted-foreground">
                        سفر شغلی شما را با ابزارهای آماده‌سازی شغلی مبتنی بر هوش
                        مصنوعی توانمند کنید.
                    </p>
                </div>
            </div>
        </footer>
    );
}
