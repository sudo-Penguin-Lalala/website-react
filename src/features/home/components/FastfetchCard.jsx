import { useSushiFish } from "../hooks/useSushiFish";
import {
  FISH_SPECIES,
  HOMELAB_SPECS,
  ROOT_EXTRA_SPECS,
} from "../constants/homelabData";

const FastfetchCard = ({ isSudo, isVi }) => {
  const {
    fishIndex,
    fishWiggling,
    sushiEats,
    fishNotice,
    handleFishClick,
  } = useSushiFish(isVi);
  return (
    <section className={`nc-card ${isSudo ? "is-root-card" : ""}`}>
      <header className="nc-card-head">
        <h2 className="nc-card-title">
          <span className="nc-prompt-glyph">&gt;</span> fastfetch --homelab {isSudo ? "--root" : ""}
        </h2>
      </header>
      <div className="nc-card-body">
        <div className="nc-fastfetch-block">
          <div className="nc-term-prompt">
            {isSudo ? (
              <>
                <span className="nc-user-root">root@reactor</span>:<span className="nc-path">~</span># fastfetch --homelab --root
              </>
            ) : (
              <>
                <span className="nc-user">nnt@reactor</span>:<span className="nc-path">~</span>$ fastfetch --homelab
              </>
            )}
          </div>
          <div className="nc-ff-grid">
            {HOMELAB_SPECS.map((spec) => (
              <div key={spec.label} className="nc-ff-item">
                <span className="nc-ff-label">{spec.label}</span>
                <span className="nc-ff-val">{spec.val}</span>
              </div>
            ))}

            <div className="nc-ff-item">
              <span className="nc-ff-label">Shell:</span>
              <span className="nc-ff-val">
                fish{" "}
                <button
                  type="button"
                  className={`nc-fish-btn ${fishWiggling ? "wiggling" : ""}`}
                  onClick={handleFishClick}
                  title={
                    fishIndex >= FISH_SPECIES.length - 1
                      ? (isVi
                        ? "Cá đã thành sushi! Bấm để mlem :D"
                        : "Fish turned into sushi! Click to nom nom :D")
                      : (isVi
                        ? `Bấm để đổi cá! (${FISH_SPECIES[fishIndex].name})`
                        : `Click to change fish! (${FISH_SPECIES[fishIndex].name})`)
                  }
                  aria-label={
                    fishIndex >= FISH_SPECIES.length - 1
                      ? (isVi ? "Cá sushi, bấm để ăn" : "Sushi fish, click to eat")
                      : (isVi
                        ? `Đổi loài cá, hiện tại: ${FISH_SPECIES[fishIndex].name}`
                        : `Cycle fish, currently: ${FISH_SPECIES[fishIndex].name}`)
                  }
                >
                  {FISH_SPECIES[fishIndex].emoji}
                </button>
                {fishNotice && (
                  <span key={sushiEats} className="nc-sushi-notice">
                    {fishNotice}
                  </span>
                )}
              </span>
            </div>

            {isSudo &&
              ROOT_EXTRA_SPECS.map((spec) => (
                <div key={spec.label} className="nc-ff-item nc-ff-item-root">
                  <span className="nc-ff-label nc-ff-label-root">{spec.label}</span>
                  <span className="nc-ff-val nc-ff-val-root">{spec.val}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FastfetchCard;
