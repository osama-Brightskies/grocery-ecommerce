import { Typography } from "@/components/ui/shared/Typography";

type AuthLeftBannerProps = {
  quote?: string;
};

export function AuthLeftBanner({
  quote = "“Keep your shelves fresh and your data even fresher.”",
}: AuthLeftBannerProps) {
  return (
    <div
      data-testid="auth-left-banner"
      className="bg-brand-primary p-12 lg:p-20 flex flex-col justify-between text-white"
    >
      {/* Logo */}
      <Typography
        variant="h1"
        className="text-3xl font-bold tracking-tight text-white"
      >
        freshly
      </Typography>

      {/* Hero Heading & Quote Card */}
      <div className="space-y-16 lg:space-y-20 my-auto max-w-lg">
        <Typography
          variant="h1"
          className="text-4xl lg:text-5xl font-bold leading-tight text-white"
        >
          A simpler way to manage your grocery business.
        </Typography>

        <div className="bg-[#288E50] p-8 rounded-2xl shadow-sm border border-white/10">
          <Typography
            variant="body"
            className="text-white text-lg font-medium leading-relaxed"
          >
            {quote}
          </Typography>
        </div>
      </div>
    </div>
  );
}
