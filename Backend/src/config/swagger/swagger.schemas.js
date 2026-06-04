
const User = {
    type: "object",
    properties: {
        _id: {
            type: "string",
            example: "64f1c2a9b1a2c3d4e5f6g7h8"
        },

        firstName: {
            type: "string",
            example: "Arun"
        },

        lastName: {
            type: "string",
            example: "Chaudhary"
        },

        emailId: {
            type: "string",
            example: "arunch23k@gmail.com"
        },

        age: {
            type: "number",
            example: 22
        },

        role: {
            type: "string",
            enum: ["user", "admin"],
            example: "user"
        },

        image: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    data: {
                        type: "string",
                        description: "Binary Buffer (base64 in Swagger)",
                        example: "base64-image-data"
                    },
                    contentType: {
                        type: "string",
                        example: "image/png"
                    }
                }
            }
        },

        address: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    label: {
                        type: "string",
                        example: "Home"
                    },
                    street: {
                        type: "string",
                        example: "Street 12"
                    },
                    city: {
                        type: "string",
                        example: "Kathmandu"
                    },
                    pincode: {
                        type: "string",
                        example: "44600"
                    },
                    isDefault: {
                        type: "boolean",
                        example: true
                    }
                }
            }
        },

        isActive: {
            type: "boolean",
            example: true
        },

        createdAt: {
            type: "string",
            example: "2026-05-29T10:00:00.000Z"
        },

        updatedAt: {
            type: "string",
            example: "2026-05-29T10:30:00.000Z"
        }
    }
}
const Payment = {
    type: "object",
    properties: {
        user: {
            type: "string",
            example: "64f1c2a9b1a2c3d4e5f6g7h8"
        },

        order: {
            type: "string",
            example: "64f1c2a9b1a2c3d4e5f6g7aa"
        },

        amount: {
            type: "number",
            example: 550
        },

        method: {
            type: "string",
            enum: ["esewa", "cod"],
            example: "esewa"
        },

        status: {
            type: "string",
            enum: ["pending", "paid", "failed", "refunded"],
            example: "pending"
        },

        transactionId: {
            type: "string",
            example: "TXN123456789"
        },

        gatewayData: {
            type: "object",
            properties: {
                pidx: {
                    type: "string",
                    example: "PIDX12345"
                },
                mobile: {
                    type: "string",
                    example: "9812345678"
                },
                amount: {
                    type: "number",
                    example: 550
                },
                statusCode: {
                    type: "string",
                    example: "200"
                }
            }
        },

        paidAt: {
            type: "string",
            example: "2026-05-29T10:30:00.000Z"
        },

        failedAt: {
            type: "string",
            example: "2026-05-29T10:35:00.000Z"
        },

        createdAt: {
            type: "string",
            example: "2026-05-29T10:00:00.000Z"
        },

        updatedAt: {
            type: "string",
            example: "2026-05-29T10:40:00.000Z"
        }
    }
}

const Order = {
    type: "object",
    properties: {
        user: {
            type: "string",
            example: "64f1c2a9b1a2c3d4e5f6g7h8"
        },

        restaurants: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    restaurantName: {
                        type: "string",
                        example: "Burger King"
                    },
                    restaurantId: {
                        type: "string",
                        example: "r101"
                    },
                    city: {
                        type: "string",
                        example: "Kathmandu"
                    },
                    locality: {
                        type: "string",
                        example: "Thamel"
                    },

                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                swiggyItemId: {
                                    type: "string",
                                    example: "item123"
                                },
                                name: {
                                    type: "string",
                                    example: "Chicken Burger"
                                },
                                price: {
                                    type: "number",
                                    example: 250
                                },
                                quantity: {
                                    type: "number",
                                    example: 2
                                },
                                image: {
                                    type: "string",
                                    example: "https://img.com/burger.jpg"
                                }
                            }
                        }
                    },

                    restaurantTotal: {
                        type: "number",
                        example: 500
                    }
                }
            }
        },

        deliveryAddress: {
            type: "object",
            properties: {
                addressId: {
                    type: "string",
                    example: "64f1c2a9b1a2c3d4e5f6g7h9"
                },
                label: {
                    type: "string",
                    example: "Home"
                },
                street: {
                    type: "string",
                    example: "Street 12"
                },
                city: {
                    type: "string",
                    example: "Kathmandu"
                },
                pincode: {
                    type: "string",
                    example: "44600"
                }
            }
        },

        totalAmount: {
            type: "number",
            example: 550
        },

        itemTotal: {
            type: "number",
            example: 500
        },

        deliveryFee: {
            type: "number",
            example: 50
        },

        status: {
            type: "string",
            enum: ["placed", "preparing", "pickedUp", "delivered", "cancelled"],
            example: "placed"
        },

        payment: {
            type: "string",
            example: "64f1c2a9b1a2c3d4e5f6g7p1"
        },

        estimatedDeliveryTime: {
            type: "string",
            example: "2026-05-29T12:30:00.000Z"
        },

        deliveredAt: {
            type: "string",
            example: "2026-05-29T12:45:00.000Z"
        },

        cancellationReason: {
            type: "string",
            example: "Customer requested cancellation"
        },

        isReoder: {
            type: "boolean",
            example: false
        },

        parentOrderId: {
            type: "string",
            example: "64f1c2a9b1a2c3d4e5f6g7aa"
        },

        reOrderCount: {
            type: "number",
            example: 1
        },

        reorderHistory: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    reorderedOrderId: {
                        type: "string",
                        example: "64f1c2a9b1a2c3d4e5f6g7bb"
                    },
                    reorderedAt: {
                        type: "string",
                        example: "2026-05-29T10:00:00.000Z"
                    }
                }
            }
        },

        createdAt: {
            type: "string",
            example: "2026-05-29T10:00:00.000Z"
        },

        updatedAt: {
            type: "string",
            example: "2026-05-29T10:30:00.000Z"
        }
    },
}
const Cart = {
    type: "object",
    properties: {
        user: {
            type: "string",
            example: "64f1c2a9b1a2c3d4e5f6g7h8"
        },

        restaurants: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    restaurantId: {
                        type: "string",
                        example: "r123"
                    },
                    restaurantName: {
                        type: "string",
                        example: "Burger King"
                    },
                    city: {
                        type: "string",
                        example: "Kathmandu"
                    },
                    locality: {
                        type: "string",
                        example: "Thamel"
                    },

                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                swiggyItemId: {
                                    type: "string",
                                    example: "i101"
                                },
                                name: {
                                    type: "string",
                                    example: "Chicken Burger"
                                },
                                price: {
                                    type: "number",
                                    example: 250
                                },
                                quantity: {
                                    type: "number",
                                    example: 2
                                },
                                image: {
                                    type: "string",
                                    example: "https://image.com/burger.jpg"
                                }
                            }
                        }
                    }
                }
            }
        },

        count: {
            type: "number",
            example: 3
        },

        totalAmount: {
            type: "number",
            example: 750
        },

        createdAt: {
            type: "string",
            example: "2026-05-29T10:00:00.000Z"
        },

        updatedAt: {
            type: "string",
            example: "2026-05-29T10:30:00.000Z"
        }
    }
}
const Restaurant = {
    type: "object",
    additionalProperties: true,   // 👈 allows any fields
    description: "Restaurant data from Swiggy API"
}
/**
 * SuccessResponse schema
 */
const SuccessResponse = {
    type: "object",
    properties: {
        success: {
            type: "boolean",
            example: true
        },

        message: {
            type: "string",
            example: "Operation completed successfully"
        },
    }
};
/**
 * ErrorResponse schema
 */
const ErrorResponse = {
    type: "object",
    properties: {
        success: {
            type: "boolean",
            example: false
        },

        message: {
            type: "string",
            example: "Something went wrong"
        },

        error: {
            type: "string",
            example: "Detailed error message"
        },

        statusCode: {
            type: "number",
            example: 500
        }
    }
};

module.exports = {
    User,
    Payment,
    Order,
    Cart,
    Restaurant,
    SuccessResponse,
    ErrorResponse

}