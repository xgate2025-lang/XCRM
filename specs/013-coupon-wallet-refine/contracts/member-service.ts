/**
 * Member Service Contract (Coupon Operations)
 * Defines the interface for interacting with member coupons.
 */

import { MemberCoupon, ManualRedemptionForm, ManualVoidForm } from '../../src/types';

export interface IMemberCouponService {
    /**
     * Fetch all coupons for a specific member.
     * @param memberId Target member ID
     */
    getMemberCoupons(memberId: string): Promise<MemberCoupon[]>;

    /**
     * Manually redeem a coupon.
     * @param couponId Target coupon ID
     * @param form Redemption details
     */
    manualRedeem(couponId: string, form: ManualRedemptionForm): Promise<void>;

    /**
     * Manually void a coupon.
     * @param couponId Target coupon ID
     * @param form Void details
     */
    manualVoid(couponId: string, form: ManualVoidForm): Promise<void>;
}
