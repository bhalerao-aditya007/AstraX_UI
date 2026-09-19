import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { Kicker } from "../components/ui/Chip";
import { Reveal } from "../components/motion";

export default function NotFound() {
    return (
        <div className="bg-records-room grain-overlay flex min-h-screen items-center justify-center">
            <Reveal className="glass-strong rounded-2xl p-10 text-center">
                <Kicker tone="ember" className="justify-center">
                    File not found
                </Kicker>
                <h1 className="mt-3 font-display text-7xl font-extrabold tracking-tight text-surface-300">
                    404
                </h1>
                <p className="mt-3 text-lg font-bold text-surface-800">
                    This record doesn't exist
                </p>
                <p className="mt-2 max-w-xs text-sm text-surface-500">
                    The case file you're looking for was never registered, or has been sealed.
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ember-500 px-6 py-2.5 text-sm font-semibold text-surface-900 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] transition-colors hover:bg-ember-400"
                >
                    <Icon name="arrow-left" size={14} />
                    Return to the front desk
                </Link>
            </Reveal>
        </div>
    );
}
