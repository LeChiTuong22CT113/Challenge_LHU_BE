/**
 * API Features - Advanced Query Helper
 * Pagination, Sorting, Filtering, Searching, Field Selection
 */

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * Filter - Filter by fields
     * Example: ?role=admin&isActive=true&age[gte]=20&age[lt]=30
     */
    filter() {
        const queryObj = { ...this.queryString };

        // Fields to exclude from filtering
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering (gte, gt, lte, lt, ne)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in|nin)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    /**
     * Search - Text search on specified fields
     * Example: ?search=john
     */
    search(fields = ['name', 'email']) {
        if (this.queryString.search) {
            const searchRegex = new RegExp(this.queryString.search, 'i');
            const searchQuery = fields.map(field => ({ [field]: searchRegex }));
            this.query = this.query.find({ $or: searchQuery });
        }
        return this;
    }

    /**
     * Sort - Sort by fields
     * Example: ?sort=name (ASC) or ?sort=-createdAt (DESC)
     * Multiple: ?sort=-createdAt,name
     */
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Default sort by newest first
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    /**
     * Select - Select specific fields
     * Example: ?fields=name,email,role
     */
    select() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            // Exclude __v by default
            this.query = this.query.select('-__v');
        }
        return this;
    }

    /**
     * Paginate - Pagination
     * Example: ?page=2&limit=10
     */
    paginate() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        this.pagination = { page, limit, skip };
        return this;
    }
}

/**
 * Build pagination response
 */
const paginateResponse = async (Model, features, filterQuery = {}) => {
    const total = await Model.countDocuments(filterQuery);
    const { page, limit } = features.pagination || { page: 1, limit: 10 };
    const pages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
    };
};

module.exports = { APIFeatures, paginateResponse };
