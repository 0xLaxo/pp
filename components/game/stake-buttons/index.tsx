import { motion } from "framer-motion";
import styles from "./DefaultStakeButtons.module.scss";
import dynamic from "next/dynamic";
import { StakeButtonsPropsType, DefaultStakeButtonsPropsType } from "./types";
import React from "react";
import { OptionType } from "../../../pages/types/game";
import { flashMsg } from "../../utils/helpers";
import { place_bet } from "../../utils/bet";
import { sol_to_lamports } from "@cubist-collective/cubist-games-lib";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

const Button = dynamic(() => import("../../../components/button"));
const Input = dynamic(() => import("../../../components/input"));
const Modal = dynamic(() => import("../../../components/modal"));
const Markdown = dynamic(() => import("../../../components/markdown"));

const Templates: any = {};

function DefaultStakeButtons({
  solanaProgram,
  connection,
  systemConfig,
  game,
  pdas,
  modals,
  setModals,
  customStake,
  setCustomStake,
  setWalletVisible,
  sendTransaction,
  termsAgreed,
  publickey,
  playerBets,
}: DefaultStakeButtonsPropsType) {
  return (
    <motion.div className={styles.options}>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        pagination={{ clickable: true, dynamicBullets: true }}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        loopFillGroupWithBlank={false}
        className={styles.swiper}
        navigation={true}
      >
        <SwiperSlide>
          <div>
            <div>marico 1</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div>
            <div>marico 2</div>
          </div>
        </SwiperSlide>
      </Swiper>
      {game.cached.definition?.options.map(
        (o: OptionType, optionId: number) => (
          <div key={`betOpt${optionId}`} className="vAligned">
            <div>
              <h4>{o.title}</h4>
              {o.description ? <p>{o.description}</p> : ""}
            </div>
            <ul className="vAligned">
              {game.data.stakeButtons.map((stakeAmount: number, k: number) => (
                <li key={`stakeBtn${optionId}-${k}`}>
                  <Button
                    style={{ backgroundColor: o.color }}
                    onClick={() =>
                      place_bet(
                        solanaProgram,
                        connection,
                        systemConfig,
                        game,
                        pdas,
                        optionId,
                        sol_to_lamports(stakeAmount),
                        termsAgreed,
                        publickey,
                        modals,
                        setModals,
                        setWalletVisible,
                        sendTransaction,
                        playerBets
                      )
                    }
                  >
                    {stakeAmount}
                  </Button>
                </li>
              ))}
              {game.data.customStakeButton ? (
                <li>
                  <Button
                    style={{ backgroundColor: o.color }}
                    onClick={() => {
                      setCustomStake({
                        id: optionId,
                        title: o.title,
                        description: o.description,
                        stake: customStake.stake,
                        color: o.color,
                        error: null,
                      });
                      setModals({ ...modals, customStake: true });
                    }}
                  >
                    Custom stake!
                  </Button>
                </li>
              ) : (
                ""
              )}
            </ul>
            <Modal
              modalId={"customStake"}
              modals={modals}
              setIsOpen={setModals}
            >
              <div>
                <h4 style={{ color: customStake.color }}>
                  {customStake.title}
                </h4>
                {!!customStake.description && (
                  <Markdown>{customStake.description as string}</Markdown>
                )}
                <div className="vAligned">
                  <Input
                    type="number"
                    autoComplete="off"
                    value={customStake.stake}
                    placeholder={`Enter SOL amount`}
                    style={{
                      width: 110,
                      borderColor: customStake.error
                        ? "var(--errorBg)"
                        : "gray",
                    }}
                    onClick={(e: any) => e.target.select()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCustomStake({
                        ...customStake,
                        stake: e.target.value,
                      })
                    }
                    maxLength="5"
                  />
                  <span>SOL</span>
                  <Button
                    onClick={() => {
                      const solAmount = parseFloat(customStake.stake);
                      let error = false;
                      if (solAmount < game.data.minStake) {
                        error = true;
                        flashMsg(
                          `The minimum stake is ${game.data.minStake} SOL`
                        );
                      }
                      const lamports = sol_to_lamports(solAmount);
                      if (lamports % sol_to_lamports(game.data.minStep) !== 0) {
                        error = true;
                        flashMsg(
                          `The minimum amount to increase/decrease a bet is ${game.data.minStep} SOL`
                        );
                      }
                      if (error) {
                        setCustomStake({
                          ...customStake,
                          error: error,
                        });
                        return;
                      }
                      place_bet(
                        solanaProgram,
                        connection,
                        systemConfig,
                        game,
                        pdas,
                        customStake.id,
                        lamports,
                        termsAgreed,
                        publickey,
                        modals,
                        setModals,
                        setWalletVisible,
                        sendTransaction,
                        playerBets
                      );
                    }}
                  >
                    Place Bet
                  </Button>
                </div>
                {/* {props.prize && !props.prediction.spl_token
                ? profitText(props.prize, props.profit)
                : null} */}
              </div>
            </Modal>
          </div>
        )
      )}
    </motion.div>
  );
}

export default function StakeButtons({
  template,
  ...props
}: StakeButtonsPropsType) {
  const StakeButtons =
    template && Templates.hasOwnProperty(template)
      ? Templates[template]
      : DefaultStakeButtons;

  return <StakeButtons {...props} />;
}
