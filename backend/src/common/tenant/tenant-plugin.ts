import { Schema } from "mongoose";

import { tenantContext } from "./tenant-context";

type TenantFilter = Record<string, unknown>;

function applyTenantFilter(
  filter: TenantFilter,
  schema: Schema
): void {
  const context = tenantContext.get();

  /**
   * Public / unauthenticated request.
   *
   * Do not apply tenant filtering here because
   * public QR/customer routes may need access.
   */
  if (!context?.authenticated) {
    return;
  }

  /**
   * SUPER_ADMIN has platform-wide access.
   */
  if (context.isSuperAdmin) {
    return;
  }

  /**
   * Authenticated user without a restaurant
   * must not be allowed to access tenant data.
   */
  if (!context.restaurantId) {
    filter.restaurantId =
      "__NO_TENANT_ACCESS__";

    return;
  }

  /**
   * Main tenant protection.
   */
  filter.restaurantId =
    context.restaurantId;

  /**
   * Branch-level protection.
   */
  if (context.branchId && schema.path("branchId")) {
    filter.branchId = context.branchId;
  }
}

export function tenantPlugin(
  schema: Schema
): void {
  /**
   * =========================================================
   * QUERY MIDDLEWARE
   * =========================================================
   *
   * Automatically adds restaurantId / branchId
   * to normal Mongoose queries.
   */
  schema.pre("find", function () {
    const filter =
      this.getFilter() as TenantFilter;

    applyTenantFilter(filter, this.model.schema);

    this.setQuery(filter);
  });

  schema.pre("findOne", function () {
    const filter =
      this.getFilter() as TenantFilter;

    applyTenantFilter(filter, this.model.schema);

    this.setQuery(filter);
  });

  schema.pre(
    "findOneAndUpdate",
    function () {
      const filter =
        this.getFilter() as TenantFilter;

      applyTenantFilter(filter, this.model.schema);

      this.setQuery(filter);
    }
  );

  schema.pre(
    "findOneAndDelete",
    function () {
      const filter =
        this.getFilter() as TenantFilter;

      applyTenantFilter(filter, this.model.schema);

      this.setQuery(filter);
    }
  );

  schema.pre("updateOne", function () {
    const filter =
      this.getFilter() as TenantFilter;

    applyTenantFilter(filter, this.model.schema);

    this.setQuery(filter);
  });

  schema.pre("updateMany", function () {
    const filter =
      this.getFilter() as TenantFilter;

    applyTenantFilter(filter, this.model.schema);

    this.setQuery(filter);
  });

  schema.pre("deleteOne", function () {
    const filter =
      this.getFilter() as TenantFilter;

    applyTenantFilter(filter, this.model.schema);

    this.setQuery(filter);
  });

  schema.pre("deleteMany", function () {
    const filter =
      this.getFilter() as TenantFilter;

    applyTenantFilter(filter, this.model.schema);

    this.setQuery(filter);
  });

  schema.pre(
    "countDocuments",
    function () {
      const filter =
        this.getFilter() as TenantFilter;

      applyTenantFilter(filter, this.model.schema);

      this.setQuery(filter);
    }
  );

  schema.pre("distinct", function () {
    const filter =
      this.getFilter() as TenantFilter;

    applyTenantFilter(filter, this.model.schema);

    this.setQuery(filter);
  });

  /**
   * =========================================================
   * AGGREGATION
   * =========================================================
   *
   * Automatically adds tenant filtering to
   * aggregation pipelines.
   */
  schema.pre("aggregate", function () {
    const context =
      tenantContext.get();

    /**
     * Public request.
     */
    if (!context?.authenticated) {
      return;
    }

    /**
     * SUPER_ADMIN.
     */
    if (context.isSuperAdmin) {
      return;
    }

    const match: TenantFilter = {};

    /**
     * No restaurant = no tenant access.
     */
    if (!context.restaurantId) {
      match.restaurantId =
        "__NO_TENANT_ACCESS__";
    } else {
      match.restaurantId =
        context.restaurantId;

      if (context.branchId && this.model().schema.path("branchId")) {
        match.branchId = context.branchId;
      }
    }

    const pipeline =
      this.pipeline();

    /**
     * $geoNear MUST be the first stage.
     *
     * Therefore we add the tenant filter
     * inside its query.
     */
    if (
      pipeline.length > 0 &&
      "$geoNear" in pipeline[0]
    ) {
      const geoNear =
        pipeline[0].$geoNear as Record<
          string,
          unknown
        >;

      const existingQuery =
        (geoNear.query as TenantFilter) ||
        {};

      geoNear.query = {
        ...existingQuery,
        ...match,
      };

      return;
    }

    /**
     * Normal aggregation.
     *
     * Add $match at the beginning.
     */
    pipeline.unshift({
      $match: match,
    });
  });

  /**
   * =========================================================
   * SAVE / CREATE
   * =========================================================
   *
   * Automatically assigns the authenticated
   * restaurantId and branchId.
   */
  schema.pre("save", function () {
    const context =
      tenantContext.get();

    /**
     * Public request.
     */
    if (!context?.authenticated) {
      return;
    }

    /**
     * SUPER_ADMIN.
     */
    if (context.isSuperAdmin) {
      return;
    }

    /**
     * User without restaurant.
     */
    if (!context.restaurantId) {
      return;
    }

    /**
     * Never trust restaurantId sent by frontend.
     */
    if (
      this.schema.path("restaurantId")
    ) {
      this.set(
        "restaurantId",
        context.restaurantId
      );
    }

    /**
     * Never trust branchId sent by frontend.
     */
    if (
      context.branchId &&
      this.schema.path("branchId")
    ) {
      this.set(
        "branchId",
        context.branchId
      );
    }
  });

  /**
   * =========================================================
   * UPDATE PROTECTION
   * =========================================================
   */
  schema.pre(
    "findOneAndUpdate",
    function () {
      applyTenantUpdate(this);
    }
  );

  schema.pre(
    "updateOne",
    function () {
      applyTenantUpdate(this);
    }
  );

  schema.pre(
    "updateMany",
    function () {
      applyTenantUpdate(this);
    }
  );
}

/**
 * =========================================================
 * FORCE TENANT INFORMATION INTO UPDATE
 * =========================================================
 */
function applyTenantUpdate(
  query: any
): void {
  const context =
    tenantContext.get();

  /**
   * Public request.
   */
  if (!context?.authenticated) {
    return;
  }

  /**
   * SUPER_ADMIN.
   */
  if (context.isSuperAdmin) {
    return;
  }

  /**
   * User without restaurant.
   */
  if (!context.restaurantId) {
    return;
  }

  const update =
    (query.getUpdate() ||
      {}) as Record<string, any>;

  const $set =
    (update.$set ||
      {}) as Record<string, unknown>;

  /**
   * Force restaurantId.
   */
  $set.restaurantId =
    context.restaurantId;

  /**
   * Force branchId when applicable.
   */
  if (context.branchId) {
    $set.branchId =
      context.branchId;
  }

  update.$set = $set;

  /**
   * Prevent frontend from removing
   * restaurantId.
   */
  if (
    update.$unset &&
    typeof update.$unset === "object"
  ) {
    delete update.$unset.restaurantId;

    if (context.branchId) {
      delete update.$unset.branchId;
    }
  }

  query.setUpdate(update);
}