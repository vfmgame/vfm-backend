module.exports = {
  user: {
    signUp: "user_signup",
    signIn: "user_signin",
    forgotPassword: "user_forgot_password",
    verifyEmail: "user_verify_email",
    resendVerifyEmail: "user_resend_verify_email",
    postGeneration: "post_generation"
  },
  workspace: {
    createWorkspace: "create_workspace",
  },
  invitation: {
    sendInvitation: "send_invitation",
    acceptInvitation: "accept_invitation"
  },
  team: {
    sendInvitation: "send_invitation",
  },
  linkedin: {
    getProfile: "get_linkedin_profile",
    addAccount: "add_connected_linkedin_account",
    removeAccount: "remove_connected_linkedin_account",
  },
  post: {
    schedulePost: "schedule_post",
    unschedulePost: "unschedule_post",
    updateScheduledPost: "update_scheduled_post",
    publishPost: "publish_post",
    failedPost: "failed_post",
  },
  payment: {
    paidInvoice: "paid_invoice",
    subscribed: "subscribed",
  },
  engage: {
    createContact: "create_contact",
    deleteContact: "delete_contact",
  },
};